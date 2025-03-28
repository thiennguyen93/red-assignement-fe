import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, InputNumber, Select, Upload, UploadFile } from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";

export const BlogPostCreate = () => {
  const { formProps, saveButtonProps, ...rest } = useForm({
  });
  
  const apiUrl = useApiUrl();
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const { selectProps: categorySelectProps } = useSelect({
    resource: "category",
    optionLabel: "name",
    optionValue: "id",
  });


  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" >
        <Form.Item
          label={"Name"}
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
    </Create>
  );
};
