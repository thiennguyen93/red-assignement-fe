import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useApiUrl } from "@refinedev/core";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, InputNumber, Select, Upload, UploadFile } from "antd";
import { useState } from "react";

export const BlogPostEdit = () => {
  const { formProps, saveButtonProps, query, formLoading, ...rest } = useForm({});

  const apiUrl = useApiUrl();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
    
  const blogPostsData = query?.data?.data;

  const { selectProps: categorySelectProps } = useSelect({
    resource: "category",
    defaultValue: blogPostsData?.category,
    queryOptions: {
      enabled: !!blogPostsData?.id,
    },
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"name"}
          name={["name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Description"}
          name="description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
        <Form.Item hidden name={"fileName"} label={"File Name"}>
          <Input />
        </Form.Item>
        <Upload.Dragger
          name="file"
          action={`${apiUrl}/file/upload-single`}
          listType="picture"
          maxCount={1}
          fileList={fileList}
          method="POST"
          onChange={(e) => {
            setFileList(e.fileList);
            if (e.file.status === "done") {
              rest.form.setFieldValue("fileName", e.file.response?.filename)
            }
            if (!e.fileList.length) {
              rest.form.setFieldValue("fileName", "")
            }
          }}
        >
          <p className="ant-upload-text">Drag & drop a file in this area</p>
        </Upload.Dragger>
        <Form.Item
          label={"Category"}
          name={["categoryId"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item
          label={"Price"}
          name={["price"]}
          initialValue={0}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label={"Stock"}
          name={["stock"]}
          initialValue={0}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
