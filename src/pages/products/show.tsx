import { Descriptions, Divider, Spin } from "antd";
import { DateField, MarkdownField, Show } from "@refinedev/antd";
import { useApiUrl, useOne, useShow } from "@refinedev/core";

export const BlogPostShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const { data: categoryData, isLoading: categoryIsLoading } = useOne({
    resource: "category",
    id: record?.category?.id || "",
    queryOptions: {
      enabled: !!record,
    },
  });

  const apiUrl = useApiUrl();

  return (
    <Show isLoading={isLoading}>
      <Descriptions
        column={{ xs: 1, sm: 2, lg: 3 }} // Hiển thị 1 cột trên màn hình nhỏ, 2 cột trên màn hình trung bình, và 3 cột trên màn hình lớn
        title="Product Details"
        layout="horizontal" // Sử dụng layout ngang
        size="middle"
      >
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{record?.name}</Descriptions.Item>
        <Descriptions.Item label="Description">
          <MarkdownField value={record?.description} />
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          {categoryIsLoading ? <Spin size="small" /> : categoryData?.data?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Price">{record?.price}</Descriptions.Item>
        <Descriptions.Item label="Stock">{record?.stock}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          <DateField value={record?.createdAt} />
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions>
        {record?.fileName && (
          <Descriptions.Item label="Photo">
            <img
              src={`${apiUrl}/file/retrieve/${record.fileName}`}
              alt={record.name}
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          </Descriptions.Item>
        )}
      </Descriptions>
    </Show>
  );
};