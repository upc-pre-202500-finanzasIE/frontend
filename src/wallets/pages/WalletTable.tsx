import React, { useState } from "react";
import { Table, Menu, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletButtonsComponent from "../components/WalletsButtonsComponent.tsx";

interface DataType {
    key: string;
    id: string;
    nombre: string;
    cliente: string;
    numeroLetrasFacturas: number;
    bank: string;
    letters: string[];
}

const WalletTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState<{ [key: string]: boolean }>({});
    const [data] = useState<DataType[]>([]);
    const [pageSize, setPageSize] = useState(5);
    const [, setSelectedWalletId] = useState<string | null>(null);

    const handleDropdownVisibleChange = (key: string, visible: boolean) => {
        setDropdownVisible((prev) => ({ ...prev, [key]: visible }));
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: DataType[]) => {
            if (selectedKeys.length > 1) {
                toast.warning("Solo puede seleccionar una cartera a la vez", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                const selectedId = selectedRows.length > 0 ? selectedRows[0].id : null;
                setSelectedRowKeys(selectedKeys as string[]);
                setIsItemSelected(selectedKeys.length > 0);
                setSelectedWalletId(selectedId);
            }
        },
        type: "checkbox",
    };

    const columns = [
        { title: "Código", dataIndex: "id", key: "id", width: 100 },
        { title: "Nombre de la cartera", dataIndex: "nombre", key: "nombre", width: 200 },
        { title: "Nombre del cliente", dataIndex: "cliente", key: "cliente", width: 200 },
        { title: "Número de letras/facturas", dataIndex: "numeroLetrasFacturas", key: "numeroLetrasFacturas", width: 150 },
        { title: "Banco", dataIndex: "bank", key: "bank", width: 200 },
        { title: "Letras", dataIndex: "letters", key: "letters", width: 200 },
    ];

    const handlePageSizeChange = (current: number, size: number) => {
        setPageSize(size);
    };

    return (
        <div>
            <WalletButtonsComponent
                isItemSelected={isItemSelected}
            />
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

export default WalletTable;