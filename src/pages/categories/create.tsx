import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const CategoryCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
      </Form>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Description"}
          name={["description"]}
          rules={[]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
};
