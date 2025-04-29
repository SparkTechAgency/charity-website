import { Form, Input, Button, Card, Alert, Modal, InputNumber } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import useAxiosPublic from "../../../pages/hooks/useAxiosPublic";
import toast from "react-hot-toast";

const LoginForm = ({ setLoginModal, loginModal }) => {
  const axiosPublic = useAxiosPublic();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const formData = new FormData();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData(); // 👈 Create FormData first!
      formData.append("email", values.email);
      formData.append("password", values.password);

      const res = await axiosPublic.post(`/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(`User login successfully`);
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem(`authId`, res.data.data.user.id);
        form.resetFields(); // 👈 No need to "return" this, just call it
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      toast.error(
        `${error.response?.data?.message || "Something went wrong!"}`
      );
    } finally {
      setLoading(false);
      setLoginModal(false);
    }
  };

  // registration modal

  const [isModalOpen, setIsOpenModal] = useState(false);
  const openModal = () => {
    setIsOpenModal(true);
    setLoginModal(false);
  };
  const closeModal = () => {
    setIsOpenModal(false);
  };

  const token = localStorage.getItem(`forgetToken`)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Bearer added
    },
  };

// 👈 true if token exists


  // new password set modal
  const [newPasswordModal, setNewPasswordModal] = useState(false);

  const closeNewPasswordModal = () => {
    setNewPasswordModal(false);
  };

  const submitNewPasswordModal = async (values) => {
    try {
      setLoading(true)
      let res = await axiosPublic.post(`/create-new-password`,{
        email : values.email,
        new_password : values.new_password,
        new_password_confirmation : values.new_password_confirmation
      },config);

      console.log(`response is ${res}`)

      
    } catch (error) {
      toast.error(`Password forget fail please try again!`)
    }finally{
      setLoading(false)
    }
    setNewPasswordModal(false);
    alert(`Password reset successfully`);
  };

  // otp verify modal
  const [isOtpVerifyModal, setIsOtpVerifyModal] = useState(false);
  const closeOtpVerifyModal = () => {
    setIsOtpVerifyModal(false);
  };

  const submitOtpVerifyModal = async (values) => {
    try {
      setLoading(true);
      let res = await axiosPublic.post(`/otp-verify`, {
        otp: values.otp,
      });
      if (res.data.success) {
        localStorage.setItem(`forgetToken`, res?.data?.data?.token);
        form.resetFields();
        setNewPasswordModal(true);
        setIsOtpVerifyModal(false);
        toast.success(`Otp verify successfully`);
        return;
      }
    } catch (error) {
      toast.error(`Otp verify fail.`);
    } finally {
      setLoading(false);
    }
    // setNewPasswordModal(true);
    // 
  };

  // forget password modal

  const [forgetPasswordModal, setForgetPasswordModal] = useState(false);

  const openForgetPasswordModal = () => {
    setForgetPasswordModal(true);
    setLoginModal(false);
  };

  const closeForgetPasswordModal = () => {
    setForgetPasswordModal(false);
  };

  const submitForgetPasswordFrom = async (values) => {
    try {
      setLoading(true);
      let res = await axiosPublic.post(`/forgot-password`, {
        email: values.email,
      }); // 👈 small fix here too (send object, not just string)

      if (res.data.success) {
        // ✅ Email verification request successful
        toast.success("Verification email sent!");
        setForgetPasswordModal(false);
        setLoginModal(false);
        setIsOtpVerifyModal(true);
      } else {
        toast.error("Failed to send verification email.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow =
      isModalOpen || loginModal || forgetPasswordModal ? "hidden" : "auto";
  }, [isModalOpen, loginModal, forgetPasswordModal]);

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        maskClosable={false}
        keyboard={false}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email"
            className="py-2"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be minimum 6 characters." },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            className="py-2"
          />
        </Form.Item>

        {/* 👉 Here we add Forget Password link */}
        <div className="flex justify-end mb-4">
          <Link
            onClick={openForgetPasswordModal}
            to=""
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            Forgot Password?
          </Link>
        </div>

        <Form.Item>
          <Button
            loading={loading}
            disabled={loading}
            type="primary"
            htmlType="submit"
            className="lg:w-full  bg-btnColor border-none h-11 font-bold text-white text-[14px] mt-1 rounded-lg"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center ">
        <span className="text-gray-600">Don't have an account? </span>
        <Link
          onClick={openModal}
          to=""
          className="text-blue-600 hover:underline font-semibold"
        >
          Register
        </Link>
      </div>

      {/* registration modal  */}

      <Modal
        open={isModalOpen}
        footer={null}
        closable={true}
        onCancel={closeModal}
        centered
        // width="400px"
        // style={{ padding: "15px", top: 0 }}
      >
        <RegistrationForm
          setIsOpenModal={setIsOpenModal}
          setLoginModal={setLoginModal}
          isModalOpen={isModalOpen}
        />
      </Modal>

      {/* forget password modal  */}

      <Modal
        open={forgetPasswordModal}
        footer={null}
        closable={true}
        onCancel={closeForgetPasswordModal}
        maskClosable={false} 
        
        centered
      >
        <Form form={form} onFinish={submitForgetPasswordFrom} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              className="py-2"
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="lg:w-full bg-btnColor border-none h-11 font-bold text-white text-[14px] mt-1 rounded-lg"
            >
              Verify email
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* otp verify modal  */}

      <Modal
        open={isOtpVerifyModal}
        footer={null}
        onCancel={closeOtpVerifyModal}
        centered
        maskClosable={false} 
        // width="400px"
        style={{ padding: "15px", top: 0 }}
      >
        <Form form={form} onFinish={submitOtpVerifyModal} layout="vertical">
          <Form.Item
            label="OTP"
            name="otp"
            rules={[
              { required: true, message: "Please input your OTP!" },
              { type: "number", message: "OTP must be a valid number!" },
            ]}
          >
            <InputNumber
              placeholder="Enter your OTP"
              className="w-full py-2"
              controls={false} // number increment/decrement button hide kore
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="lg:w-full bg-btnColor border-none h-11 font-bold text-white text-[14px] mt-1 rounded-lg"
            >
              Verify Otp
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* set new password modal  */}

      <Modal
        open={newPasswordModal}
        footer={null}
        closable={true}
        onCancel={closeNewPasswordModal}
        centered
        
        maskClosable={false} 
      >
       <Form
  name="new_password_set"
  layout="vertical"
  onFinish={submitNewPasswordModal}
  autoComplete="off"
>
  <Form.Item
    label="Email"
    name="email"
    rules={[
      { required: true, message: "Please input your email!" },
      { type: "email", message: "Please enter a valid email!" },
    ]}
  >
    <Input
      prefix={<MailOutlined />}
      placeholder="Enter your email"
      className="py-2"
    />
  </Form.Item>

  <Form.Item
    label="Password"
    name="new_password"
    rules={[
      { required: true, message: "Please input your password!" },
      { min: 6, message: "Password must be minimum 6 characters." },
    ]}
    hasFeedback
  >
    <Input.Password
      prefix={<LockOutlined />}
      placeholder="Enter your password"
      className="py-2"
    />
  </Form.Item>

  <Form.Item
    label="Confirm Password"
    name="new_password_confirmation"
    dependencies={["new_password"]} 
    hasFeedback
    rules={[
      { required: true, message: "Please confirm your password!" },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue("new_password") === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error("Passwords do not match!"));
        },
      }),
    ]}
  >
    <Input.Password
      prefix={<LockOutlined />}
      placeholder="Confirm your password"
      className="py-2"
    />
  </Form.Item>

  <Form.Item>
    <Button
      loading={loading}
      type="primary"
      htmlType="submit"
      className="lg:w-full bg-btnColor border-none h-11 font-bold text-white text-[14px] mt-1 rounded-lg"
    >
      Set new password
    </Button>
  </Form.Item>
</Form>
      </Modal>
    </div>
  );
};

export default LoginForm;
