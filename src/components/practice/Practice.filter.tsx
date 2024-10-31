import { ChangeEvent } from "react";
import styles from "./Practice.module.css"
import { Filter } from "@/src/stores/questionStore"
import { useQuestionStore } from "@/src/stores/questionStore"
import { useCategoryStore } from "@/src/stores/categoryStore";
import { Category, ProblemType } from "@/src/stores/categoryStore";

interface CategoryToggleProps {
  categories: Category[]
}

function CategoryToggles(props: CategoryToggleProps) {

  const { filter, setFilter } = useQuestionStore();
  const { categories } = props;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {

    const { value } = e.target as HTMLInputElement;

    const newFilter = structuredClone(filter);
    const id = Number(value);

    if (filter.categories.includes(id)) {

      newFilter.categories = newFilter.categories.filter(type => type !== id)

    } else {
      newFilter.categories.push(id)
    }
    setFilter(newFilter);
  }

  const toggles = categories.map(category => {

    const checked = !filter.categories.includes(category.id)
    const { id, category: name } = category;

    return (
      <div key={`category-toggle-${id}`} className={styles.justifyCheckboxes}>
        <label htmlFor={`category-${id}`}>{name}</label>
        <input type="checkbox" id={`category-${id}`} name={"categories"} value={id} defaultChecked={checked} onChange={handleChange} />
      </div>
    )
  })

  return (
    <div>
      {toggles}
    </div>
  )


}

interface ProblemTypeToggleProps {
  problemTypes: ProblemType[]
}

function ProblemTypeToggles(props: ProblemTypeToggleProps) {

  const { filter, setFilter } = useQuestionStore();
  const { problemTypes } = props;

  // const { id, problemType: name } = problemType;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {

    const { value } = e.target as HTMLInputElement;

    const newFilter = structuredClone(filter);
    const id = Number(value);

    if (filter.problemTypes.includes(id)) {

      newFilter.problemTypes = newFilter.problemTypes.filter(type => type !== id)

    } else {
      newFilter.problemTypes.push(id)
    }
    setFilter(newFilter);
  }

  const toggles = problemTypes.map(type => {

    const checked = !filter.problemTypes.includes(type.id)

    const { id, problemType: name } = type;

    return (
      <div key={`problem-type-toggle-${id}`} className={styles.justifyCheckboxes}>
        <label htmlFor={`problem-type-${id}`}>{name}</label>
        <input type="checkbox" id={`problem-type-${id}`} name={"problemTypes"} value={id} defaultChecked={checked} onChange={handleChange} />
      </div>
    )

  })

  return (
    <div>
      {toggles}
    </div>
  )

}

interface FilterFormProps {
  categories: Category[],
  problemTypes: ProblemType[],
}

function FilterForm(props: FilterFormProps) {

  const { categories, problemTypes } = props;

  return (
    <form name="filter-form">
      <CategoryToggles categories={categories} />
      <ProblemTypeToggles problemTypes={problemTypes} />
    </form>
  )
}

export default function FilterSettings() {

  const { categories, problemTypes } = useCategoryStore();

  return (
    <div>
      <FilterForm categories={categories} problemTypes={problemTypes} />
    </div>
  )
}