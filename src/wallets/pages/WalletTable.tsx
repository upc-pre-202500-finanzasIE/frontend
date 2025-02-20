import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletButtonsComponent from "../components/WalletsButtonsComponent.tsx";
import { getAllWallets } from "../services/WalletService.tsx";
import { getAllLetters } from "../services/LetterService.tsx";

interface DataType {
    key: string;
    id: string;
    nombre: string;
    letterCount: number;
    fechaDescuento: string;
    valorNeto: number;
    valorEntregado: number;
    valorRecibido: number;
}

const WalletTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [data, setData] = useState<DataType[]>([]);
    const [pageSize, setPageSize] = useState(5);
    const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const wallets = await getAllWallets();
            const letters = await getAllLetters();

            const formattedData = wallets.map((wallet: any) => {
                const walletLetters = letters.filter((letter: any) => letter.walletId === wallet.id);

                return {
                    key: wallet.id,
                    id: wallet.id,
                    nombre: wallet.nombre,
                    letterCount: walletLetters.length,
                    fechaDescuento: wallet.fechaDescuento,
                    valorNeto: wallet.valorNeto,
                    valorEntregado: wallet.valorEntregado,
                    valorRecibido: wallet.valorRecibido,
                };
            });

            setData(formattedData);
        } catch (error) {
            toast.error("Error al cargar los datos.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
        { title: "Nombre de la cartera", dataIndex: "nombre", key: "nombre", width: 200 },
        {
            title: "Número de letras/facturas",
            dataIndex: "letterCount",
            key: "numeroLetrasFacturas",
            width: 150,
        },
        { title: "Código", dataIndex: "id", key: "id", width: 100 },
        { title: "Fecha de descuento", dataIndex: "fechaDescuento", key: "fechaDescuento", width: 200 },
        { title: "Valor Neto", dataIndex: "valorNeto", key: "valorNeto", width: 150 },
        { title: "Valor Entregado", dataIndex: "valorEntregado", key: "valorEntregado", width: 150 },
        { title: "Valor Recibido", dataIndex: "valorRecibido", key: "valorRecibido", width: 150 },
    ];

    const handlePageSizeChange = (current: number, size: number) => {
        setPageSize(size);
    };

    return (
        <div>
            <WalletButtonsComponent isItemSelected={isItemSelected} selectedWalletId={selectedWalletId} onFormSubmit={fetchData} />
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