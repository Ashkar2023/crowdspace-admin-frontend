import { useEffect, useMemo, useState } from 'react';
import { Button, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import MenuIcon from "@mui/icons-material/Menu";
import { axiosPrivate } from '../service/api';
import { buildImageUrl } from '../utils/imageUrl';
import Sidebar from '../components/ui/sidebar';

const columns = [
    { name: "Report ID", key: "_id" },
    { name: "Reported By", key: "reported_by" },
    { name: "Target", key: "target_id" },
    { name: "Target Type", key: "target_type" },
    { name: "Reason", key: "reason" },
    { name: "Description", key: "description" },
    { name: "Status", key: "status" },
    { name: "Token ID", key: "tokenId" },
    { name: "Created At", key: "createdAt" },
    { name: "Updated At", key: "updatedAt" },
    { name: "Actions", key: "actions" },
];

const ReportsPage = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(2);
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const response = await axiosPrivate.get(`/admin/reports?page=${page}&limit=${rowsPerPage}`);
            setData(response.data.body);
            setError(null);
        } catch (err) {
            setError('Failed to fetch reports');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [page, rowsPerPage]);

    const pages = useMemo(() => {
        return data?.totalReports ? Math.ceil(data.totalReports / rowsPerPage) : 0;
    }, [data?.totalReports, rowsPerPage]);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            await axiosPrivate.patch(`/admin/reports/${reportId}/status`, { status: newStatus });
            setData(prevData => ({
                ...prevData,
                reports: prevData.reports.map(report =>
                    report._id === reportId ? { ...report, status: newStatus } : report
                )
            }));
        } catch (error) {
            console.error('Error updating report status:', error);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between px-4 py-3 bg-white border-b">
                    <Button isIconOnly onClick={toggleSidebar} className="md:hidden">
                        <MenuIcon />
                    </Button>
                    <h1 className="text-xl font-semibold">Reports Management</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                    <Table
                        aria-label="Reports table"
                        bottomContent={
                            pages > 0 ? (
                                <div className="flex w-full justify-center">
                                    <Pagination
                                        isCompact
                                        showControls
                                        showShadow
                                        color="primary"
                                        page={page}
                                        total={pages}
                                        onChange={(page) => setPage(page)}
                                    />
                                </div>
                            ) : null
                        }
                        classNames={{
                            wrapper: "min-h-[222px]",
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody
                            items={data?.reports || []}
                            emptyContent={error || "No reports found"}
                            isLoading={isLoading}
                            loadingContent={<Spinner label="Loading..." />}
                        >
                            {(item) => (
                                <TableRow key={item.tokenId}>
                                    {(columnKey) => (
                                        <TableCell>
                                            {columnKey === 'createdAt' || columnKey === 'updatedAt' ? (
                                                new Date(item[columnKey]).toLocaleString()
                                            ) : columnKey === "reported_by" ? (
                                                item[columnKey].username
                                            ) : columnKey === "target_id" ? (
                                                <img
                                                    className='rounded object-contain'
                                                    src={buildImageUrl(item[columnKey].media[0].media_url).href}
                                                    alt="Target"
                                                />
                                            ) : columnKey === "actions" ? (
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button variant="bordered">
                                                            Change Status
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        aria-label="Change report status"
                                                        onAction={(key) => handleStatusChange(item._id, key)}
                                                    >
                                                        <DropdownItem key="pending">Pending</DropdownItem>
                                                        <DropdownItem key="reviewed">Reviewed</DropdownItem>
                                                        <DropdownItem key="dismissed">Dismissed</DropdownItem>
                                                        <DropdownItem key="resolved">Resolved</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            ) : (
                                                item[columnKey]
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </main>
            </div>
        </div>
    );
};

export default ReportsPage;

