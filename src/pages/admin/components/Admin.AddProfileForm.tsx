import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./Admin.module.css";


import { useProfilesStore } from "@/src/stores/profilesStore";

import addNewInstructor from "@/src/queries/POST/addNewInstructor";
import addNewProfile from "@/src/queries/POST/addNewProfile";

import Dropdown from "components/dropdown/Dropdown";

type Role = "admin" | "tutor" | "student"

export interface NewProfileForm {
  firstName: string
  lastName: string
  name: string
  email: string
  role: Role | ""
  [field: string]: string
}

interface AddProfileFormProps {
  setShow: Dispatch<SetStateAction<boolean>>
}

export default function AddProfileForm(props: AddProfileFormProps) {

  const { setShow } = props;

  const students = useProfilesStore((state) => state.students)
  const instructors = useProfilesStore((state) => state.instructors)
  const setStudents = useProfilesStore((state) => state.setStudents)
  const setInstructors = useProfilesStore((state) => state.setInstructors)

  const roles: ["student", "tutor", "admin"] = ["student", "tutor", "admin"]

  const selectedRoleRef = useRef<number | null>(null);

  const defaultForm: NewProfileForm = {
    firstName: "",
    lastName: "",
    name: "",
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

    newForm.name = `${newForm.firstName} ${newForm.lastName}`

    setNewProfileForm(newForm);

  }

  async function handleSubmit() {
    try {
      const role = newProfileForm.role;

      switch (role) {
        case ("admin"):
        case ("student"):
          const newProfileData = await addNewProfile(newProfileForm);
          const newStudents = [...students].concat(newProfileData);

          setStudents(newStudents);

          break;
        case ("tutor"):
          const newInstructorData = await addNewInstructor(newProfileForm);
          const newInstructors = [...instructors].concat(newInstructorData);

          setInstructors(newInstructors);
      }
    }
    catch (e) {
      console.error(e);
      resetForm();
      return;
    }
    finally {
      resetForm();
      setShow(false);
      console.log("Success!");
    }
  }

  function resetForm() {
    setNewProfileForm(defaultForm);
    selectedRoleRef.current = null;
  }

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
    <form className={[
      styles.alignForm,
      styles.formStyle,
    ].join(" ")}>
      <label htmlFor="new-profile-first-name">
        First Name:
        <input id="new-profile-first-name"
          className={[
            styles.inputStyle,
          ].join(" ")}
          type="text"
          name="firstName"
          value={newProfileForm.firstName}
          onChange={handleForm} />
      </label>
      <label htmlFor="new-profile-last-name">
        Last Name:
        <input id="new-profile-last-name"
          className={[
            styles.inputStyle,
          ].join(" ")}
          type="text"
          name="lastName"
          value={newProfileForm.lastName}
          onChange={handleForm} />
      </label>
      <label htmlFor="new-profile-email-address">
        Email Address:
        <input id="new-profile-email-address"
          className={[
            styles.inputStyle,
          ].join(" ")}
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
      <button
        className={[
          styles.buttonStyle
        ].join(" ")}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
        Add Profile
      </button>
    </form>
  )

}