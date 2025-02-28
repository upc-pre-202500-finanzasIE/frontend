import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Table } from "antd";
import { toast } from "react-toastify";
import { getBankByTipoMoneda, getAllBanks } from "../services/BanksService";
import { getAllWallets, updateWalletBankId } from "../services/WalletService";

interface AssociatingWalletBankFormProps {
    visible: boolean;
    onCancel: () => void;
    wallet: { nombre: string; tipoDeCartera: string; id: number };
    onFormSubmit: (bankId: number) => void;
}

const AssociatingWalletBankForm: React.FC<AssociatingWalletBankFormProps> = ({ visible, onCancel, wallet, onFormSubmit }) => {
    const [banks, setBanks] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
    const [isBankSelected, setIsBankSelected] = useState(false);

    useEffect(() => {
        const fetchBanks = async () => {
            const tipoMoneda = wallet.tipoDeCartera;
            try {
                const response = await getBankByTipoMoneda(tipoMoneda);
                setBanks(response);
            } catch (error) {
                console.error("Error fetching banks:", error);
            }
        };

        fetchBanks();
    }, [wallet]);

    const handleSubmit = async () => {
        if (selectedBankId !== null) {
            await updateWalletBankId(wallet.id, selectedBankId);
            onFormSubmit(selectedBankId);
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
            if (selectedKeys.length > 1) {
                toast.warning("Solo puede seleccionar un banco a la vez", {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }
            setSelectedRowKeys(selectedKeys as number[]);
            setSelectedBankId(selectedRows.length > 0 ? selectedRows[0].id : null);
            setIsBankSelected(selectedKeys.length > 0);
        },
        type: "checkbox",
    };

    const columns = [
        { title: "Nombre del banco", dataIndex: "nombreBanco", key: "nombreBanco", width: 200 },
        {
            title: "Tipo de Tasa Ofrecida",
            dataIndex: "tipoTasa",
            key: "tipoTasa",
            width: 200,
            render: (_: any, record: any) => record.nominal ? "Nominal" : "Efectiva"
        },
        {
            title: "Tipo de Moneda",
            dataIndex: "tipoMoneda",
            key: "tipoMoneda",
            width: 200,
            render: (_: any, record: any) => record.dolares ? "Dólares" : "Soles"
        },
        {
            title: "Tasa de Interés",
            dataIndex: "tasaDeInteres",
            key: "tasaDeInteres",
            width: 150,
            render: (text: number) => `${text}%`
        }
    ];

    return (
        <Modal visible={visible} onCancel={onCancel} footer={null} title={`Usted está asociando su cartera de tipo ${wallet.tipoDeCartera} llamada ${wallet.nombre}`}>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Seleccione el banco" required>
                    <Table
                        rowKey="id"
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={banks}
                        pagination={false}
                        scroll={{ y: 240 }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={!isBankSelected}>
                        Asociar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AssociatingWalletBankForm;
