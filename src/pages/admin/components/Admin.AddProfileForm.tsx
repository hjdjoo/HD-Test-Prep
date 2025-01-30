import { useState } from "react";
import styles from "./Admin.module.css";


import Dropdown from "components/dropdown/Dropdown";

type Role = "admin" | "tutor" | "student"

interface NewProfileForm {
  firstName: string
  lastName: string
  fullName: string
  email: string
  role: Role | ""
}



export default function AddProfileForm() {

  const roles: ["student", "tutor", "admin"] = ["student", "tutor", "admin"]

  const defaultForm: NewProfileForm = {
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    role: "",
  }

  const [newProfileForm, setNewProfileForm] = useState<NewProfileForm>(defaultForm)

  function handleDropdown(role: Role) {

    const newForm = { ...newProfileForm };
    newForm.role = role;

    setNewProfileForm(newForm)
  }

  console.log("AddProfileForm/newProfileForm: ", newProfileForm)

  const dropdownItems = roles.map((role, idx) => {

    return (
      <Dropdown.Item key={`new-profile-dropdown-item-${idx + 1}`}
        onClick={() => {
          handleDropdown(role)
        }}>
        {`${role}`}
      </Dropdown.Item>
    )
  })

  return (
    <form style={{ display: "flex", flexDirection: "column", marginTop: "1rem", alignItems: "center" }}>
      <label htmlFor="new-profile-first-name">
        First Name:
        <input id="new-profile-first-name" type="text" />
      </label>
      <label htmlFor="new-profile-last-name">
        Last Name:
        <input id="new-profile-last-name" type="text" />
      </label>
      <label htmlFor="new-profile-email-address">
        Email Address:
        <input id="new-profile-email-address" type="text" />
      </label>
      <label htmlFor="new-profile-role">
        Role:
        <Dropdown>
          <Dropdown.List>
            {dropdownItems}
          </Dropdown.List>
        </Dropdown>
      </label>
    </form>
  )

}