import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { banUser, unbanUser } from '../../state/slices/adminSlice';
import { axiosPrivate } from '../../service/api';

const columns = [
    { name: "Email", key: "email" },
    { name: "Username", key: "username" },
    { name: "CreatedAt", key: "createdat" },
    { name: "Status", key: "status" },
    { name: "Action", key: "action" },
];

const UserTable = () => {
    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [rowsCount, setRowsCount] = useState(2);
    const [actionLoading, setActionLoading] = useState(null);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axiosPrivate.post(`/user/admin/users?page=${page}&limit=${rowsCount}`);
            setData(response.data.body);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, rowsCount]);

    const handleStatusChange = async (userId,currentStatus) => {
        try {
            setActionLoading(userId);

            const action = currentStatus ? unbanUser : banUser;
            const result = await dispatch(action(userId));

            if (result.payload.success) {
                setData(prevData => {
                    if (!prevData) return null;
                    return {
                        ...prevData,
                        users: prevData.users.map(user =>
                            user._id === userId ? { ...user, isBanned: !currentStatus } : user
                        )
                    };
                });
            }
        } catch (error) {
            console.error('Error changing user status:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const pages = useMemo(() => {
        return data?.totalUsers ? Math.ceil(data.totalUsers / rowsCount) : 0;
    }, [data?.totalUsers, rowsCount]);

    return (
        <>
            <div className='w-full h-10 mb-4'>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="flat">
                            Rows per page: {rowsCount}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu 
                        aria-label="Row count selection"
                        selectionMode="single"
                        selectedKeys={new Set([rowsCount.toString()])}
                        onSelectionChange={(keys) => setRowsCount(Number(Array.from(keys)[0]))}
                    >
                        <DropdownItem key="2">2</DropdownItem>
                        <DropdownItem key="5">5</DropdownItem>
                        <DropdownItem key="10">10</DropdownItem>
                        <DropdownItem key="20">20</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            <Table
                aria-label='users management table'
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
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.key}
                            align={['action', "status"].includes(column.key) ? "center" : "start"}
                            className="text-sm font-semibold"
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={error || "No users found"}
                    items={data?.users ?? []}
                    isLoading={isLoading}
                    loadingContent={<Spinner label="Loading users..." />}
                >
                    {(user) => (
                        <TableRow key={user.username}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Chip
                                    color={user.isBanned ? "danger" : "success"}
                                    variant='dot'
                                    className='text-xs border-none'
                                >
                                    {user.isBanned ? "banned" : "active"}
                                </Chip>
                            </TableCell>
                            <TableCell align='center'>
                                <Button
                                    size='sm'
                                    color={user.isBanned ? "primary" : "danger"}
                                    isLoading={actionLoading === user._id}
                                    onClick={() => handleStatusChange(user._id, user.isBanned)}
                                >
                                    {user.isBanned ? "Unban" : "Ban"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
};

export default UserTable;

