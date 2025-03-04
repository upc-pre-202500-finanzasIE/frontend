import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Form, Input, Button, InputNumber, Card, Select, Checkbox, Tooltip } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { insertBank } from "../services/BanksService.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

interface FormValues {
    nombreBanco: string;
    tasaDeInteres: number;
    tipoTasa: string;
    capitalizacion: number;
    tipoMoneda: string;
    periodoTasa: number;
    gastosIniciales: {
        seguroInicial: number;
        comisionPagoInicial: number;
        interesesLetrasFacturas: number;
    };
    gastosFinales: {
        comisionSeguro: number;
        comisionTipoMoneda: number;
        comisionFija: number;
    };
}

const CreateBankForm: React.FC<{ onCancel: () => void; onFormSubmit: () => void; initialValues?: FormValues; readOnly?: boolean }> = forwardRef(({ onCancel, onFormSubmit = () => {}, initialValues, readOnly }, ref) => {
    const [form] = Form.useForm();
    const [considerGastosIniciales, setConsiderGastosIniciales] = useState(false);
    const [considerGastosFinales, setConsiderGastosFinales] = useState(false);
    const [tipoTasa, setTipoTasa] = useState<string | undefined>(initialValues?.tipoTasa);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    useImperativeHandle(ref, () => ({
        resetFields: () => {
            form.resetFields();
            setConsiderGastosIniciales(false);
            setConsiderGastosFinales(false);
        }
    }));

    const onFinish = async (values: FormValues) => {
        const parsedValues = {
            ...values,
            nominal: values.tipoTasa === "nominal",
            efectiva: values.tipoTasa === "efectiva",
            dolares: values.tipoMoneda === "dolares",
            soles: values.tipoMoneda === "soles",
            gastosIniciales: considerGastosIniciales ? JSON.stringify(values.gastosIniciales) : null,
            gastosFinales: considerGastosFinales ? JSON.stringify(values.gastosFinales) : null,
        };

        console.log("Submitted values:", parsedValues);

        try {
            await insertBank(parsedValues);
            toast.success("Banco creado exitosamente", { position: "top-right", autoClose: 3000 });
            onFormSubmit();
            onCancel();
        } catch (error) {
            console.log("ERROR", error);
            if (error.response) {
                console.log("Error response data:", error.response.data);
                console.log("Error response status:", error.response.status);
                console.log("Error response headers:", error.response.headers);
            }
            toast.error("Error al crear el banco", { position: "top-right", autoClose: 3000 });
        }
    };
    return (
        <Card title={readOnly ? "Detalles del Banco" : "Crear Nuevo Banco"} style={{ width: "100%" }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="nombreBanco" label="Nombre del Banco" rules={[{ required: true, message: "Ingrese el nombre del banco" }]}>
                    <Input disabled={readOnly} />
                </Form.Item>
                <Form.Item name="tasaDeInteres" label="Tasa de Interés" rules={[{ required: true, message: "Ingrese la tasa de interés" }]}>
                    <InputNumber style={{ width: "100%" }} disabled={readOnly} />
                </Form.Item>
                <Form.Item name="tipoTasa" label="Tipo de Tasa" rules={[{ required: true, message: "Seleccione el tipo de tasa" }]}>
                    <Select disabled={readOnly} onChange={(value) => setTipoTasa(value)}>
                        <Select.Option value="nominal">Nominal</Select.Option>
                        <Select.Option value="efectiva">Efectiva</Select.Option>
                    </Select>
                </Form.Item>
                {tipoTasa === "nominal" && (
                    <Form.Item name="capitalizacion" label="Capitalización" rules={[{ required: true, message: "Ingrese la capitalización" }]}>
                        <InputNumber style={{ width: "100%" }} disabled={readOnly} />
                    </Form.Item>
                )}
                <Form.Item
                    name="periodoTasa"
                    label={
                        <span>
            Periodo de Tasa&nbsp;
                            <Tooltip title="90 días significa tasa trimestral, 60 días tasa bimestral, 120 días tasa cuatrimestral, 30 días tasa mensual, 15 días tasa quincenal y 360 días tasa anual, también puede contar tasas que sean por días como cada 1 día, 2 días, etc.">
                <FontAwesomeIcon icon={faInfoCircle} />
            </Tooltip>
        </span>
                    }
                    rules={[{ required: true, message: "Ingrese el periodo de tasa" }]}
                >
                    <InputNumber style={{ width: "100%" }} disabled={readOnly} />
                </Form.Item>
                <Form.Item name="tipoMoneda" label="Tipo de Moneda" rules={[{ required: true, message: "Seleccione el tipo de moneda" }]}>
                    <Select disabled={readOnly}>
                        <Select.Option value="soles">Soles</Select.Option>
                        <Select.Option value="dolares">Dólares</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="considerGastosIniciales" valuePropName="checked">
                    <Checkbox onChange={(e) => setConsiderGastosIniciales(e.target.checked)} disabled={readOnly}>Considerar Gastos Iniciales</Checkbox>
                </Form.Item>
                {considerGastosIniciales && (
                    <>
                        <Form.Item
                            name={["gastosIniciales", "seguroInicial"]}
                            label={
                                <span>
            Seguro Inicial&nbsp;
                                    <Tooltip title="Este valor es un porcentaje">
                <FontAwesomeIcon icon={faInfoCircle} />
            </Tooltip>
        </span>
                            }
                            rules={[{ required: true, message: "Ingrese el seguro inicial" }]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                formatter={value => `${value}%`}
                                disabled={readOnly}
                            />
                        </Form.Item>
                        <Form.Item name={["gastosIniciales", "comisionPagoInicial"]} label="Costo por letra" rules={[{ required: true, message: "Ingrese la comisión por pago inicial" }]}>
                            <InputNumber style={{ width: "100%" }} disabled={readOnly} />
                        </Form.Item>
                        <Form.Item name={["gastosIniciales", "interesesLetrasFacturas"]} label="Intereses por Letras/Facturas" rules={[{ required: true, message: "Ingrese los intereses por letras/facturas" }]}>
                            <InputNumber style={{ width: "100%" }} disabled={readOnly} />
                        </Form.Item>
                    </>
                )}
                <Form.Item name="considerGastosFinales" valuePropName="checked">
                    <Checkbox onChange={(e) => setConsiderGastosFinales(e.target.checked)} disabled={readOnly}>Considerar Gastos Finales</Checkbox>
                </Form.Item>
                {considerGastosFinales && (
                    <>
                        <Form.Item name={["gastosFinales", "comisionSeguro"]} label="Comisión de Seguro" rules={[{ required: true, message: "Ingrese la comisión de seguro" }]}>
                            <InputNumber style={{ width: "100%" }} disabled={readOnly} />
                        </Form.Item>
                        <Form.Item name={["gastosFinales", "comisionTipoMoneda"]} label="Comisión por Tipo de Moneda" rules={[{ required: true, message: "Ingrese la comisión por tipo de moneda" }]}>
                            <InputNumber style={{ width: "100%" }} disabled={readOnly} />
                        </Form.Item>
                        <Form.Item
                            name={["gastosFinales", "comisionFija"]}
                            label={
                                <span>
            Comisión Fija&nbsp;
                                    <Tooltip title="Este valor es un porcentaje">
                <FontAwesomeIcon icon={faInfoCircle} />
            </Tooltip>
        </span>
                            }
                            rules={[{ required: true, message: "Ingrese la comisión fija" }]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                formatter={value => `${value}%`}
                                disabled={readOnly}
                            />
                        </Form.Item>
                    </>
                )}
                {!readOnly && (
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Crear Banco</Button>
                        <Button type="default" onClick={onCancel} style={{ marginLeft: "8px" }}>Cancelar</Button>
                    </Form.Item>
                )}
            </Form>
        </Card>
    );
});

export default CreateBankForm;