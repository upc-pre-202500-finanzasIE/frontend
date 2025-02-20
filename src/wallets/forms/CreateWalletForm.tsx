// src/wallets/forms/CreateWalletForm.tsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Input, Button, DatePicker, Select, Card } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { getByTipoMoneda } from "../services/LetterService";
import { saveWallet } from "../services/WalletService";

interface FormValues {
    nombre: string;
    letters: string[];
    tipoDeCartera: string;
    fechaDescuento: moment.Moment;
}

interface Letter {
    id: number;
    cliente: string;
    valorNominal: number;
}

const CreateWalletForm = forwardRef<unknown, { onCancel: () => void; onFormSubmit?: () => void; initialValues?: FormValues; readOnly?: boolean }>(
    ({ onCancel, onFormSubmit = () => {}, initialValues, readOnly }, ref) => {
        const [form] = Form.useForm();
        const [letters, setLetters] = useState<Letter[]>([]);
        const [tipoDeCartera, setTipoDeCartera] = useState<string>(initialValues?.tipoDeCartera || "");

        useEffect(() => {
            if (tipoDeCartera) {
                fetchLetters(tipoDeCartera);
            }
        }, [tipoDeCartera]);

        const fetchLetters = async (tipoMoneda: string) => {
            try {
                const response: Letter[] = await getByTipoMoneda(tipoMoneda, initialValues?.letters || []);
                console.log("Letters fetched for tipoDeCartera:", tipoMoneda, response);
                setLetters(response);
            } catch (error) {
                toast.error("Error fetching letters", { position: "top-right", autoClose: 3000 });
            }
        };

        useImperativeHandle(ref, () => ({
            resetFields: () => {
                form.resetFields();
                setTipoDeCartera("");
                setLetters([]);
            }
        }));

        const onFinish = async (values: FormValues) => {
            const parsedValues = {
                nombre: values.nombre,
                bank: null,
                letterIds: values.letters,
                fechaDescuento: values.fechaDescuento.format("YYYY-MM-DD"),
                tipoDeCartera: values.tipoDeCartera
            };

            console.log("Valores antes de enviar:", parsedValues);

            try {
                await saveWallet(parsedValues);
                toast.success("Cartera creada exitosamente", { position: "top-right", autoClose: 3000 });
                onFormSubmit();
                onCancel();
            } catch (error) {
                console.log("Error ", error);
                toast.error("Error al crear la cartera", { position: "top-right", autoClose: 3000 });
            }
        };

        return (
            <Card title={readOnly ? `Viendo detalles de la cartera` : "Crear Nueva Cartera"} style={{ width: "100%" }}>
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
                    <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: "Ingrese el nombre" }]}>
                        <Input disabled={readOnly} />
                    </Form.Item>

                    <Form.Item name="tipoDeCartera" label="Tipo de Cartera" rules={[{ required: true, message: "Seleccione el tipo de cartera" }]}>
                        <Select value={tipoDeCartera} onChange={(value) => setTipoDeCartera(value)} disabled={readOnly}>
                            <Select.Option value="soles">Soles</Select.Option>
                            <Select.Option value="dolares">Dólares</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="letters" label="Cartas" rules={[{ required: true, message: "Seleccione las cartas" }]}>
                        <Select mode="multiple" disabled={readOnly}>
                            {letters.map((letter) => (
                                <Select.Option key={letter.id} value={letter.id}>
                                    {letter.cliente} - {letter.valorNominal}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="fechaDescuento" label="Fecha de Descuento" rules={[{ required: true, message: "Ingrese la fecha de descuento" }]}>
                        <DatePicker disabled={readOnly} />
                    </Form.Item>

                    {!readOnly && (
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Crear Cartera
                            </Button>
                            <Button type="default" onClick={onCancel} style={{ marginLeft: "8px" }}>
                                Cancelar
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </Card>
        );
    }
);

export default CreateWalletForm;