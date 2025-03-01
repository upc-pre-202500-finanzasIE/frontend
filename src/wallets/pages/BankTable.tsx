// src/wallets/pages/BankTable.tsx
import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BanksButtonsComponent from "../components/BanksButtonsComponent.tsx";
import { getAllBanks } from "../services/BanksService.tsx";

interface DataType {
    key: string;
    id: string;
    nombreBanco: string;
    tasaDeInteres: number;
    nominal: boolean;
    efectiva: boolean;
    capitalizacion: string | null;
    dolares: boolean;
    soles: boolean;
    gastosIniciales: string | null;
    gastosFinales: string | null;
}

const BankTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [data, setData] = useState<DataType[]>([]);
    const [pageSize, setPageSize] = useState(5);
    const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

    const fetchBanks = async () => {
        try {
            const banks = await getAllBanks();
            const banksWithKeys = banks.map((bank: DataType) => ({ ...bank, key: bank.id }));
            setData(banksWithKeys);
        } catch (error) {
            console.error("Error fetching banks:", error);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: DataType[]) => {
            if (selectedKeys.length > 1) {
                toast.warning("Solo puede seleccionar un banco a la vez", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                const selectedId = selectedRows.length > 0 ? selectedRows[0].id : null;
                setSelectedRowKeys(selectedKeys as string[]);
                setIsItemSelected(selectedKeys.length > 0);
                setSelectedBankId(selectedId);
            }
        },
        type: "checkbox"
    };

    const columns = [
        { title: "Nombre del banco", dataIndex: "nombreBanco", key: "nombreBanco", width: 200 },
        {
            title: "Tipo de Tasa Ofrecida",
            dataIndex: "tipoTasa",
            key: "tipoTasa",
            width: 200,
            render: (_: any, record: DataType) => record.nominal ? "Nominal" : "Efectiva"
        },
        {
            title: "Tipo de Moneda",
            dataIndex: "tipoMoneda",
            key: "tipoMoneda",
            width: 200,
            render: (_: any, record: DataType) => record.dolares ? "Dólares" : "Soles"
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

    const handlePageSizeChange = (current: number, size: number) => {
        setPageSize(size);
    };

    return (
        <div>
            <BanksButtonsComponent isItemSelected={isItemSelected} selectedBankId={selectedBankId} onFormSubmit={fetchBanks} />
            <Table
                bordered
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                pagination={{
                    pageSize: pageSize,
                    pageSizeOptions: ["5", "10", "25", "100"],
                    showSizeChanger: true,
                    onShowSizeChange: handlePageSizeChange,
                }}
            />
            <ToastContainer />
        </div>
    );
};

export default BankTable;