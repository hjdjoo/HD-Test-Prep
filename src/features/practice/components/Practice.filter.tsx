import { ChangeEvent } from "react";
import { useStore } from "zustand";
import styles from "./Practice.Components.module.css"
// import { Filter } from "@/src/stores/questionStore"
import { questionStore } from "@/src/stores/questionStore"
import { useCategoryStore } from "@/src/stores/categoryStore";
import { Category, ProblemType } from "@/src/stores/categoryStore";

interface CategoryToggleProps {
  categories: Category[]
}

function CategoryToggles(props: CategoryToggleProps) {

  const filter = useStore(questionStore, (state) => state.filter)
  const setFilter = useStore(questionStore, (state) => state.setFilter);
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
      <div key={`category-toggle-${id}`}
        className={[
          styles.justifyCheckboxes,
          styles.filterTextSize
        ].join(" ")}>
        <label htmlFor={`category-${id}`}>{name}
          <input id={`category-${id}`} type="checkbox"
            className={[
              styles.checkboxMargins,
            ].join(" ")}
            name={"categories"}
            value={id}
            defaultChecked={checked}
            onChange={handleChange} />
          <span className={[
            styles.customCheckbox
          ].join(" ")}></span>
        </label>
      </div>
    )
  })

  return (
    <div className={[styles.checkboxesVertical].join(" ")} >
      <h4>Categories: </h4>
      {toggles}
    </div>
  )


}

interface ProblemTypeToggleProps {
  problemTypes: ProblemType[]
}

function ProblemTypeToggles(props: ProblemTypeToggleProps) {

  const filter = questionStore.getState().filter;
  const setFilter = questionStore.getState().setFilter;
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
      <div key={`problem-type-toggle-${id}`}
        className={[
          styles.justifyCheckboxes,
          styles.filterTextSize
        ].join(" ")}>
        <label htmlFor={`problem-type-${id}`}>{name}</label>
        <input type="checkbox" id={`problem-type-${id}`}
          className={[styles.checkboxMargins].join(" ")}
          name={"problemTypes"}
          value={id}
          defaultChecked={checked}
          onChange={handleChange} />
      </div>
    )

  })

  return (
    <div className={styles.checkboxesVertical} >
      <h4>Problem Types: </h4>
      {toggles}
    </div>
  )

}

function DifficultyToggles() {

  const filter = questionStore.getState().filter;
  const setFilter = questionStore.getState().setFilter;

  const { difficulty } = filter;

  // const { id, problemType: name } = problemType;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {

    const { value } = e.target as HTMLInputElement;

    const newFilter = structuredClone(filter);
    // const difficulty = value;
    newFilter.difficulty[value] = !filter.difficulty[value]

    setFilter(newFilter);
  }

  const toggles = Object.keys(difficulty).map(level => {

    const checked = filter.difficulty[level]
    const label = level[0].toUpperCase().concat(level.slice(1))

    return (
      <div key={`${level}-difficulty-toggle`}
        className={[
          styles.justifyCheckboxes,
          styles.filterTextSize
        ].join(" ")}>
        <label htmlFor={`${level}-difficulty`}>{label}</label>
        <input type="checkbox" id={`${level}-difficulty`}
          className={[
            styles.checkboxMargins,
          ].join(" ")}
          name={"problemTypes"}
          value={level}
          defaultChecked={checked}
          onChange={handleChange} />
      </div>
    )

  })

  return (
    <div className={styles.checkboxesVertical} >
      <h4>Difficulties: </h4>
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
    <form name="filter-form" className={[
      styles.alignFilters,
      styles.sectionMargin,
    ].join(" ")}>
      <div>
        <DifficultyToggles />
        <br />
        <CategoryToggles categories={categories} />
      </div>
      <div>
        <ProblemTypeToggles problemTypes={problemTypes} />
      </div>
    </form>
  )
}

export default function FilterSettings() {

  const { categories, problemTypes } = useCategoryStore();

  return (
    <>
      <FilterForm categories={categories} problemTypes={problemTypes} />
    </>
  )
}