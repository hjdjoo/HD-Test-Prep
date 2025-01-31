import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./Admin.module.css";

import Dropdown from "components/dropdown/Dropdown";

type Role = "admin" | "tutor" | "student"

export interface NewProfileForm {
  firstName: string
  lastName: string
  fullName: string
  email: string
  role: Role | ""
  [field: string]: string
}

interface AddProfileFormProps {
  setShow: Dispatch<SetStateAction<boolean>>
}

export default function AddProfileForm(props: AddProfileFormProps) {

  const { setShow } = props;

  const roles: ["student", "tutor", "admin"] = ["student", "tutor", "admin"]

  const selectedRoleRef = useRef<number | null>(null);

  const defaultForm: NewProfileForm = {
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    role: "",
  }

  const [newProfileForm, setNewProfileForm] = useState<NewProfileForm>(defaultForm)

  function handleDropdown(role: Role, idx: number) {

    const newForm = { ...newProfileForm };
    newForm.role = role;

    selectedRoleRef.current = idx;
    setNewProfileForm(newForm)
  }

  function handleForm(e: ChangeEvent<HTMLInputElement>) {

    const { name, value } = e.target;

    const newForm: NewProfileForm = { ...newProfileForm };

    newForm[name] = value;

    newForm.fullName = `${newForm.firstName} ${newForm.lastName}`

    setNewProfileForm(newForm);

  }

  async function handleSubmit(role: Role) {

    try {
      switch (role) {
        case ("admin"):

        case ("student"):

        case ("tutor"):

      }
    }
    catch (e) {
      console.error(e);
    }
    finally {

      resetForm();
    }
  }

  function resetForm() {
    setNewProfileForm(defaultForm);
    selectedRoleRef.current = null;
  }

  console.log("AddProfileForm/newProfileForm: ", newProfileForm)

  const dropdownItems = roles.map((role, idx) => {

    return (
      <Dropdown.Item key={`new-profile-dropdown-item-${idx + 1}`}
        idx={idx}
        selectedIdx={selectedRoleRef.current}
        onClick={() => {
          handleDropdown(role, idx)
        }}>
        {`${role}`}
      </Dropdown.Item>
    )
  })

  return (
    <form style={{ display: "flex", flexDirection: "column", marginTop: "1rem", alignItems: "center", border: "1px solid grey" }}>
      <label htmlFor="new-profile-first-name">
        First Name:
        <input id="new-profile-first-name"
          type="text"
          name="firstName"
          value={newProfileForm.firstName}
          onChange={handleForm} />
      </label>
      <label htmlFor="new-profile-last-name">
        Last Name:
        <input id="new-profile-last-name"
          type="text"
          name="lastName"
          value={newProfileForm.lastName}
          onChange={handleForm} />
      </label>
      <label htmlFor="new-profile-email-address">
        Email Address:
        <input id="new-profile-email-address"
          type="text"
          name="email"
          value={newProfileForm.email}
          onChange={handleForm} />
      </label>
      <label htmlFor="new-profile-role">
        Role:
        <Dropdown id="new-profile-dropdown">
          <Dropdown.Button>
            Select account role
          </Dropdown.Button>
          <Dropdown.List>
            {dropdownItems}
          </Dropdown.List>
        </Dropdown>
      </label>
      <button onClick={(e) => {
        e.preventDefault();
        setShow(false);
      }}>
        Add Profile
      </button>
    </form>
  )

}