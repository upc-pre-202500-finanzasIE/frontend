import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Input, Button, DatePicker, Select, Card, Table, Checkbox } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { getByTipoMoneda } from "../services/LetterService";
import { saveWallet } from "../services/WalletService";

interface FormValues {
    nombre: string;
    letters: number[];
    tipoDeCartera: string;
    fechaDescuento: moment.Moment;
}

interface Letter {
    id: number;
    cliente: string;
    valorNominal: number;
    fechaFirma: string;
    fechaVencimiento: string;
}

const CreateWalletForm = forwardRef(({ onCancel, onFormSubmit = () => {}, initialValues, readOnly }, ref) => {
    const [form] = Form.useForm();
    const [letters, setLetters] = useState<Letter[]>([]);
    const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
    const [tipoDeCartera, setTipoDeCartera] = useState<string>(initialValues?.tipoDeCartera || "");

    useEffect(() => {
        if (tipoDeCartera) {
            fetchLetters(tipoDeCartera);
        }
    }, [tipoDeCartera]);

    const fetchLetters = async (tipoMoneda: string) => {
        try {
            const response: Letter[] = await getByTipoMoneda(tipoMoneda, initialValues?.letters || []);
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
            setSelectedLetters([]);
        }
    }));

    const onFinish = async (values: FormValues) => {
        const parsedValues = {
            nombre: values.nombre,
            letterIds: selectedLetters,
            fechaDescuento: values.fechaDescuento.format("YYYY-MM-DD"),
            tipoDeCartera: values.tipoDeCartera
        };

        try {
            await saveWallet(parsedValues);
            toast.success("Cartera creada exitosamente", { position: "top-right", autoClose: 3000 });
            onFormSubmit();
            onCancel();
        } catch (error) {
            toast.error("Error al crear la cartera", { position: "top-right", autoClose: 3000 });
        }
    };

    const columns = [
        {
            title: "Seleccionar",
            key: "select",
            render: (_, record) => (
                <Checkbox
                    checked={selectedLetters.includes(record.id)}
                    onChange={(e) => {
                        const updatedSelection = e.target.checked
                            ? [...selectedLetters, record.id]
                            : selectedLetters.filter(id => id !== record.id);
                        setSelectedLetters(updatedSelection);
                    }}
                />
            )
        },
        { title: "Cliente", dataIndex: "cliente", key: "cliente" },
        { title: "Valor Nominal", dataIndex: "valorNominal", key: "valorNominal" },
        {
            title: "Fecha Firma",
            dataIndex: "fechaFirma",
            key: "fechaFirma",
            render: (text: string) => moment(text).format("DD/MM/YYYY")
        },
        {
            title: "Fecha Vencimiento",
            dataIndex: "fechaVencimiento",
            key: "fechaVencimiento",
            render: (text: string) => moment(text).format("DD/MM/YYYY")
        }
    ];

    return (
        <Card title={readOnly ? "Viendo detalles de la cartera" : "Crear Nueva Cartera"} style={{ width: "100%" }}>
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

                <Table dataSource={letters} columns={columns} rowKey="id" pagination={false} />

                <Form.Item name="fechaDescuento" label="Fecha de Descuento" rules={[{ required: true, message: "Ingrese la fecha de descuento" }]}>
                    <DatePicker disabled={readOnly} />
                </Form.Item>

                {!readOnly && (
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={selectedLetters.length === 0}>
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
});

export default CreateWalletForm;
