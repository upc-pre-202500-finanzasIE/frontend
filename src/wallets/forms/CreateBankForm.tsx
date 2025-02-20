import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Form, Input, Button, InputNumber, Card, Row, Col, Select, Checkbox } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { insertBank } from "../services/BankService";

interface FormValues {
    nombreBanco: string;
    tasaDeInteres: number;
    isNominal: boolean;
    isEfectiva: boolean;
    capitalizacion?: string;
    isDolares: boolean;
    isSoles: boolean;
}

const CreateBankForm: React.FC<{ onCancel: () => void; onFormSubmit: () => void; initialValues?: FormValues; readOnly?: boolean }> = forwardRef(({ onCancel, onFormSubmit, initialValues, readOnly }, ref) => {
    const [form] = Form.useForm();
    const [isNominal, setIsNominal] = useState(initialValues?.isNominal || false);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    useImperativeHandle(ref, () => ({
        resetFields: () => {
            form.resetFields();
            setIsNominal(false);
        }
    }));

    const onFinish = async (values: FormValues) => {
        const parsedValues = {
            ...values,
            tasaDeInteres: values.tasaDeInteres / 100, // Convert to percentage
        };

        console.log("Valores antes de enviar:", parsedValues);

        try {
            await insertBank(parsedValues);
            toast.success("Banco creado exitosamente", { position: "top-right", autoClose: 3000 });
            onFormSubmit();
            onCancel();
        } catch (error) {
            console.log("Error ", error);
            toast.error("Error al crear el banco", { position: "top-right", autoClose: 3000 });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsNominal(false);
        onCancel();
    };

    return (
        <Card title={readOnly ? `Viendo detalles del banco ${initialValues?.nombreBanco}` : "Crear Nuevo Banco"} style={{ width: "100%" }}>
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
                <Form.Item name="nombreBanco" label="Nombre del Banco" rules={[{ required: true, message: "Ingrese el nombre del banco" }]}>
                    <Input disabled={readOnly} />
                </Form.Item>

                <Form.Item name="tasaDeInteres" label="Tasa de Interés (%)" rules={[{ required: true, message: "Ingrese la tasa de interés" }]}>
                    <InputNumber style={{ width: "100%" }} disabled={readOnly} />
                </Form.Item>

                <Form.Item name="isNominal" valuePropName="checked" label="IS Nominal">
                    <Checkbox onChange={(e) => setIsNominal(e.target.checked)} disabled={readOnly} />
                </Form.Item>

                <Form.Item name="isEfectiva" valuePropName="checked" label="IS Efectiva">
                    <Checkbox disabled={readOnly} />
                </Form.Item>

                {isNominal && (
                    <Form.Item name="capitalizacion" label="Capitalización" rules={[{ required: true, message: "Ingrese la capitalización" }]}>
                        <Input disabled={readOnly} />
                    </Form.Item>
                )}

                <Form.Item name="isDolares" valuePropName="checked" label="Dólares">
                    <Checkbox disabled={readOnly} />
                </Form.Item>

                <Form.Item name="isSoles" valuePropName="checked" label="Soles">
                    <Checkbox disabled={readOnly} />
                </Form.Item>

                {!readOnly && (
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Crear Banco
                        </Button>
                        <Button type="default" onClick={handleCancel} style={{ marginLeft: "8px" }}>
                            Cancelar
                        </Button>
                    </Form.Item>
                )}
            </Form>
        </Card>
    );
});

export default CreateBankForm;