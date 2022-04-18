import DashboardLayout from "$/layouts/dashboard";
import {
  Card,
  Group,
  Pagination,
  Select,
  Space,
  Stack,
  Table,
  Title,
} from "@mantine/core";
import type { NextPage } from "next";
import React, { useMemo } from "react";
import { Column, usePagination, useTable } from "react-table";

interface Record {
  id: number;
  position: number;
  mass: number;
  symbol: string;
  name: string;
}

const Home: NextPage = () => {
  // const rows = elements.map((element, index) => (
  //   <tr key={element.name}>
  //     <td>{index + 1}</td>
  //     <td>{element.position}</td>
  //     <td>{element.name}</td>
  //     <td>{element.symbol}</td>
  //     <td>{element.mass}</td>
  //   </tr>
  // ));

  const data = useMemo<Record[]>(
    () => [
      { id: 1, position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
      { id: 2, position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
      { id: 3, position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
      { id: 4, position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
      { id: 5, position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
    ],
    []
  );

  const columns = useMemo<Column<Record>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "POSITION",
        accessor: "position",
      },
      {
        Header: "MASS",
        accessor: "mass",
      },
      {
        Header: "SYMBOL",
        accessor: "symbol",
      },
      {
        Header: "NAME",
        accessor: "name",
      },
    ],
    []
  );

  const {
    prepareRow,
    headerGroups,
    getTableProps,
    getTableBodyProps,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data, initialState: { pageSize: 3 } }, usePagination);

  return (
    <DashboardLayout>
      <Card shadow="sm" p="lg">
        <Stack spacing="xs">
          <Title order={4}>This is h3 title</Title>
          {/* <Table highlightOnHover horizontalSpacing="sm" verticalSpacing="xs">
            <thead>
              <tr>
                <th>№</th>
                <th>Element position</th>
                <th>Element name</th>
                <th>Symbol</th>
                <th>Atomic mass</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table> */}
          <Table
            highlightOnHover
            horizontalSpacing="sm"
            verticalSpacing="xs"
            {...getTableProps()}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} key={column.id}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell, cellInd) => (
                      <td {...cell.getCellProps()} key={cellInd}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Group position="right">
            <Select
              searchable
              style={{ width: 84 }}
              value={pageSize.toString()}
              onChange={(value) => setPageSize(parseInt(value || "20", 10))}
              data={[
                { value: "1", label: "1" },
                { value: "3", label: "3" },
                { value: "5", label: "5" },
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "50", label: "50" },
                { value: "100", label: "100" },
                { value: "200", label: "200" },
              ]}
            />
            <Space />
            <Pagination
              withEdges
              siblings={1}
              page={pageIndex + 1}
              total={pageOptions.length}
              onChange={(page) => gotoPage(page - 1)}
              getItemAriaLabel={(page) => {
                switch (page) {
                  case "dots":
                    return "dots element aria-label";
                  case "prev":
                    return "previous page button aria-label";
                  case "next":
                    return "next page button aria-label";
                  case "first":
                    return "first page button aria-label";
                  case "last":
                    return "last page button aria-label";
                  default:
                    return `${page} item aria-label`;
                }
              }}
            />
          </Group>
        </Stack>
      </Card>
    </DashboardLayout>
  );
};

export default Home;
