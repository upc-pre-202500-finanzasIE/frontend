import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Form, Input, Button, DatePicker, InputNumber, Card, Row, Col, Select, Checkbox } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { insertLetter } from "../services/LetterService";

interface FormValues {
    cliente: string;
    fechaFirma: moment.Moment;
    fechaVencimiento?: moment.Moment;
    hasPlazo: boolean;
    plazo?: number;
    valorNominal: number;
    moneda: string;
    soles: boolean;
    dolares: boolean;
}

const CreateLetterForm: React.FC<{ onCancel: () => void; onFormSubmit: () => void; initialValues?: FormValues; readOnly?: boolean }> = forwardRef(({ onCancel, onFormSubmit, initialValues, readOnly }, ref) => {
    const [form] = Form.useForm();
    const [hasPlazo, setHasPlazo] = useState(initialValues?.hasPlazo || false);
    const [fechaVencimiento, setFechaVencimiento] = useState<moment.Moment | null>(initialValues?.fechaVencimiento || null);
    const [moneda, setMoneda] = useState<string>(initialValues?.soles ? "soles" : initialValues?.dolares ? "dolares" : "");

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                fechaFirma: moment(initialValues.fechaFirma),
                fechaVencimiento: initialValues.fechaVencimiento ? moment(initialValues.fechaVencimiento) : null,
                moneda: initialValues.soles ? "Soles" : initialValues.dolares ? "Dolares" : ""
            });

        }
    }, [initialValues, form]);



    useImperativeHandle(ref, () => ({
        resetFields: () => {
            form.resetFields();
            setHasPlazo(false);
            setFechaVencimiento(null);
            setMoneda("");
        }
    }));

    const onFinish = async (values: FormValues) => {
        let plazo = values.plazo;
        if (!hasPlazo && values.fechaFirma && fechaVencimiento) {
            plazo = fechaVencimiento.diff(values.fechaFirma, 'days');
        }

        const parsedValues = {
            ...values,
            fechaFirma: values.fechaFirma.format("YYYY-MM-DD"),
            fechaVencimiento: fechaVencimiento ? fechaVencimiento.format("YYYY-MM-DD") : null,
            plazo: plazo,
            soles: moneda === "soles",
            dolares: moneda === "dolares"
        };

        console.log("Valores antes de enviar:", parsedValues);

        try {
            await insertLetter(parsedValues);
            toast.success("Letra/Factura creada exitosamente", { position: "top-right", autoClose: 3000 });
            onFormSubmit();
            onCancel();
        } catch (error) {
            console.log("Error ", error)
            toast.error("Error al crear la Letra/Factura", { position: "top-right", autoClose: 3000 });
        }
    };

    const handlePlazoChange = (value: number | null) => {
        if (hasPlazo) {
            const fechaFirma = form.getFieldValue("fechaFirma") as moment.Moment;
            if (fechaFirma && value !== null) {
                const newFechaVencimiento = fechaFirma.clone().add(value, 'days');
                setFechaVencimiento(newFechaVencimiento);
                form.setFieldsValue({ fechaVencimiento: newFechaVencimiento });
            } else {
                setFechaVencimiento(null);
                form.setFieldsValue({ fechaVencimiento: null });
            }
        }
    };

    const handleFechaFirmaChange = (date: moment.Moment | null) => {
        if (!hasPlazo) {
            setFechaVencimiento(null);
            form.setFieldsValue({ fechaVencimiento: null });
        } else {
            handlePlazoChange(form.getFieldValue("plazo"));
        }
    };

    const handleFechaVencimientoChange = (date: moment.Moment | null) => {
        const fechaFirma = form.getFieldValue("fechaFirma") as moment.Moment;
        if (fechaFirma && date) {
            const newPlazo = date.diff(fechaFirma, 'days');
            form.setFieldsValue({ plazo: newPlazo });
            setFechaVencimiento(date);
        } else {
            setFechaVencimiento(null);
            form.setFieldsValue({ fechaVencimiento: null });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setHasPlazo(false);
        setFechaVencimiento(null);
        setMoneda("");
        onCancel();
    };

    return (
        <Card title={readOnly ? `Viendo detalles de la letra de cliente ${initialValues?.cliente}` : "Crear Nueva Letra/Factura"} style={{ width: "100%" }}>
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ hasPlazo: false }} key={moneda}>
                <Form.Item name="cliente" label="Cliente" rules={[{ required: true, message: "Ingrese el cliente" }]}>
                    <Input disabled={readOnly} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="fechaFirma"
                            label="Fecha de Firma"
                            rules={[{ required: true, message: "Por favor ingrese la fecha de firma" }]}
                        >
                            <DatePicker onChange={handleFechaFirmaChange} disabled={readOnly} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="fechaVencimiento"
                            label="Fecha de Vencimiento"
                            rules={[
                                { required: !hasPlazo, message: "Por favor ingrese la fecha de vencimiento" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || value.isAfter(getFieldValue("fechaFirma"))) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("La fecha de vencimiento no puede ser menor a la fecha de firma"));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker value={fechaVencimiento} disabled={hasPlazo || readOnly} onChange={handleFechaVencimientoChange} placeholder="" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="hasPlazo"
                    valuePropName="checked"
                    label="Tiene plazo de días"
                >
                    <Checkbox onChange={(e) => setHasPlazo(e.target.checked)} disabled={readOnly} />
                </Form.Item>
                {hasPlazo && (
                    <Form.Item
                        name="plazo"
                        label="Plazo"
                        rules={[{ required: true, message: "Por favor ingrese el plazo" }]}
                    >
                        <InputNumber style={{ width: "100%" }} onChange={handlePlazoChange} disabled={readOnly} />
                    </Form.Item>
                )}
                <Form.Item name="valorNominal" label="Valor Nominal" rules={[{ required: true, message: "Ingrese el valor nominal" }]}>
                    <InputNumber style={{ width: "100%" }} disabled={readOnly} />
                </Form.Item>

                <Form.Item name="moneda" label="Moneda" rules={[{ required: true, message: "Seleccione una moneda" }]}>
                    {readOnly ? (
                        <Input value={moneda === "soles" ? "Soles" : "Dólares"} disabled />
                    ) : (
                        <Select value={moneda} onChange={(value) => {
                            console.log("Selected moneda:", value);
                            setMoneda(value);
                        }} disabled={readOnly}>
                            <Select.Option value="soles">Soles</Select.Option>
                            <Select.Option value="dolares">Dólares</Select.Option>
                        </Select>
                    )}
                </Form.Item>
                {!readOnly && (
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Crear Letra/Factura
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

export default CreateLetterForm;