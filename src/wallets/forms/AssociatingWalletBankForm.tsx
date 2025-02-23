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
            console.log('wallet.tipoDeCartera:', wallet.tipoDeCartera);
            const tipoMoneda = wallet.tipoDeCartera;
            try {
                const response = await getBankByTipoMoneda(tipoMoneda);
                console.log('Banks fetched by tipoMoneda:', response);
                setBanks(response);
            } catch (error) {
                console.error("Error fetching banks:", error);
            }
        };

        fetchBanks();

        // Call getAllBanks to see the log output
        getAllBanks().then(response => {
            console.log('All banks:', response);
        }).catch(error => {
            console.error("Error fetching all banks:", error);
        });
    }, [wallet]);

    useEffect(() => {
        const fetchWallets = async () => {
            const wallets = await getAllWallets();
            console.log('All wallets:', wallets);
        };

        fetchWallets();
    }, []);

    const handleSubmit = async () => {
        if (selectedBankId !== null) {
            console.log('Associating wallet with bankId:', selectedBankId);
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
            } else {
                setSelectedRowKeys(selectedKeys as number[]);
                setSelectedBankId(selectedRows.length > 0 ? selectedRows[0].id : null);
                setIsBankSelected(selectedRows.length > 0);
            }
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
        },
        {
            title: "Capitalización",
            dataIndex: "capitalizacion",
            key: "capitalizacion",
            width: 200,
            render: (text: string | null) => text ? `${text} días` : "No se toma en cuenta capitalización"
        },
        {
            title: "¿Incluye Gastos Iniciales?",
            dataIndex: "gastosIniciales",
            key: "gastosIniciales",
            width: 200,
            render: (text: string | null) => text ? "Sí incluye" : "No incluye"
        },
        {
            title: "¿Incluye Gastos Finales?",
            dataIndex: "gastosFinales",
            key: "gastosFinales",
            width: 200,
            render: (text: string | null) => text ? "Sí incluye" : "No incluye"
        }
    ];

    return (
        <Modal visible={visible} onCancel={onCancel} footer={null} title={`Usted está asociando su cartera de tipo ${wallet.tipoDeCartera} llamada ${wallet.nombre}`}>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Seleccione el banco" required>
                    <Table
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