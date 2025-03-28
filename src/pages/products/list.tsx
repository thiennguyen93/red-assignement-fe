import { QuestionCircleFilled, SearchOutlined } from "@ant-design/icons";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useSelect,
  useTable,
} from "@refinedev/antd";
import { BaseOption, CrudFilter, LogicalFilter, useApiUrl, useMany, type BaseRecord } from "@refinedev/core";
import { Avatar, Button, Card, Form, FormProps, Image, Input, SelectProps, Space, Table } from "antd";
import { DefaultOptionType } from "antd/es/select";

export const BlogPostList = () => {
  const { tableProps, filters, searchFormProps, tableQuery, setFilters } = useTable({
    syncWithLocation: true,
    onSearch: (params) => {
      const filters: LogicalFilter[] = [];
      const { query_string }: any = params;
        filters.push({
          field: "name",
          operator: "contains",
          value: query_string,
        });
      return filters;
    },
  });

  const { data: categoryData, isLoading: categoryIsLoading } = useMany({
    resource: "category",
    ids:
      tableProps?.dataSource
        ?.map((item) => item?.category?.id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { selectProps } = useSelect({
    resource: "category",
    pagination: {
      current: 1,
      mode: "server",
      pageSize: 100,
    },
    optionLabel: "name",
    optionValue: "id",
    queryOptions: {
      enabled: !!tableQuery?.data?.data?.length
    }
  });

  const apiUrl = useApiUrl();

  return (
    <List>
      <Card
        title={false}
        style={{ marginBottom: 16 }}
      >
        <Filter
          selectProps={selectProps}
          formProps={searchFormProps}
          filters={filters}
          setFilters={setFilters}
        />
      </Card>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column
          dataIndex={"fileName"}
          title={"Photo"}
          render={(value) =>
            value ? (
              <Image
                width={64}
                height={64}
                src={`${apiUrl}/file/retrieve/${value}`}
              />
            ) : (
              <Avatar
                size={64}
                shape="square"
                icon={<QuestionCircleFilled />}
              />
            )
          }
        />
        <Table.Column sorter dataIndex="name" title={"Name"} />
        <Table.Column
          sorter
          dataIndex="description"
          title={"description"}
          render={(value: any) => {
            if (!value) return "-";
            return <MarkdownField value={value.slice(0, 80) + "..."} />;
          }}
        />
        <Table.Column
          dataIndex={"category"}
          title={"Category"}
          render={(value) =>
            categoryIsLoading ? (
              <>Loading...</>
            ) : (
              (categoryData?.data as any)?.data?.find(
                (item: { id: any }) => item.id === value?.id
              )?.name
            )
          }
        />
        <Table.Column dataIndex="stock" title={"Stock"} sorter />
        <Table.Column dataIndex="price" title={"Price"} sorter />
        <Table.Column
          dataIndex={["createdAt"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

interface FilterProps {
  formProps: FormProps;
  selectProps: SelectProps<BaseOption, DefaultOptionType>;
  filters: CrudFilter[];
  setFilters: any;
}

const Filter: React.FC<FilterProps> = ({ formProps, selectProps, filters, setFilters }) => {
  const initialFlowId = filters?.find((item) => item.operator === "and")
    ?.value?.[0]?.value;
  const initialQueryString = filters?.find((item) => item.operator === "or")
    ?.value?.[0]?.value; //
  const customInputStyles = { minWidth: 200 };
  return (
    <Form
      layout="inline"
      {...formProps}
      initialValues={{
        flow_id: initialFlowId,
        query_string: initialQueryString,
      }}
    >
      <Form.Item label="Search" name="query_string">
        <Input
          placeholder="Question or Answer"
          prefix={<SearchOutlined />}
          style={customInputStyles}
          allowClear
        />
      </Form.Item>
      {/* <Form.Item label="Category" name="categoryId">
        <Select
          {...selectProps}
          allowClear
          placeholder="Filter by Category"
          style={customInputStyles}
          popupMatchSelectWidth={true}
        />
      </Form.Item> */}
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};