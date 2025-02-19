import React, { useState } from "react";
import { Table } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletButtonsComponent from "../components/WalletsButtonsComponent.tsx";

interface DataType {
    key: string;
    id: string;
    nombreBanco: string;
    tasaDeInteres: number;
    isNominal: number;
    isEfectiva: number;
    capitalizacion: string;
    isDolares: boolean;
    isSoles: boolean;
}

const BankTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [data] = useState<DataType[]>([]);
    const [pageSize, setPageSize] = useState(5);
    const [, setSelectedBankId] = useState<string | null>(null);

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
        type: "checkbox",
    };

    const columns = [
        { title: "Código", dataIndex: "id", key: "id", width: 100 },
        { title: "Nombre del Banco", dataIndex: "nombreBanco", key: "nombreBanco", width: 200 },
        { title: "Tasa de Interés", dataIndex: "tasaDeInteres", key: "tasaDeInteres", width: 150 },
        { title: "IS Nominal", dataIndex: "isNominal", key: "isNominal", width: 150 },
        { title: "IS Efectiva", dataIndex: "isEfectiva", key: "isEfectiva", width: 150 },
        { title: "Capitalización", dataIndex: "capitalizacion", key: "capitalizacion", width: 150 },
        { title: "Dólares", dataIndex: "isDolares", key: "isDolares", width: 100 },
        { title: "Soles", dataIndex: "isSoles", key: "isSoles", width: 100 },
    ];

    const handlePageSizeChange = (current: number, size: number) => {
        setPageSize(size);
    };

    return (
        <div>
            <WalletButtonsComponent isItemSelected={isItemSelected} />
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