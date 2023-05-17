import type { FormRule } from "antd";

const validPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const validUsername = /^[A-Za-z]+$/i;

type Rule = FormRule;

interface Rules {
  fullName: Rule[];
  firstName: Rule[];
  lastName: Rule[];
  email: Rule[];
  password: Rule[];
  confirmPass: Rule[];
}

const rules: Rules = {
  fullName: [
    { required: true, message: "Nama tidak boleh kosong" },
    { min: 5, message: "Nama, panjang minimal 5 karakter!" },
  ],
  firstName: [
    { required: true, message: "Nama Depan tidak boleh kosong" },
    { min: 3, message: "Nama Depan panjang minimal 3 karakter!" },
  ],
  lastName: [
    { required: true, message: "Nama Belakang tidak boleh kosong" },
    { min: 3, message: "Nama Belakang panjang minimal 3 karakter!" },
    {
      pattern: validUsername,
      message: "Nama Belakang tidak sesuai!",
    },
  ],
  email: [
    { required: true, message: "Email tidak boleh kosong" },
    { min: 5, message: "Email panjang minimal 5 karakter!" },
    {
      pattern: validEmail,
      message: "Format email harus benar!",
    },
  ],
  password: [
    { required: true, message: "Password tidak boleh kosong!" },
    {
      pattern: validPassword,
      message:
        "Password harus berisi setidaknya satu angka, satu simbol, satu huruf besar dan kecil, dan panjang minimal 8 karakter",
    },
  ],
  confirmPass: [
    {
      required: true,
      message: "Konfirmasi Password tidakboleh kosong!",
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error(
            "Konfirmasi password tidak sesuai!"
          )
        );
      },
    }),
  ]
};

export { validPassword, validEmail, validUsername, rules };
