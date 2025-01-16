import { ChangeEvent, MouseEvent, KeyboardEvent, Dispatch, SetStateAction, useState, } from "react";

import styles from "./Autocomplete.module.css";
import animations from "@/src/animations.module.css";

import { useTagStore } from "@/src/stores/tagStore";
import { FeedbackForm } from "@/src/features/practice/components/Practice.feedback";

import debounce from "@/utils/debounce";

import DeleteIcon from "@/src/assets/icons/deleteIcon.svg";
import AddIcon from "@/src/assets/icons/addIcon.svg";


interface SuggestionsListProps {
  resetSearch: () => void;
  filteredSuggestions: string[]
  activeIdx: number
  setActiveIdx: Dispatch<SetStateAction<number>>
  activeTags: string[]
  setActiveTags: Dispatch<SetStateAction<string[]>>
}

function SuggestionsList(props: SuggestionsListProps) {

  const { resetSearch, filteredSuggestions, activeIdx, setActiveIdx, activeTags, setActiveTags } = props;

  // const delete = () => {
  //   deleteIcon();
  // }

  function handleClick(e: MouseEvent<HTMLDivElement>) {

    console.log("target: ", e.target);
    console.log("currentTarget: ", e.currentTarget);

    const { innerText } = e.currentTarget as HTMLDivElement;

    console.log(innerText);
    if (activeTags.includes(innerText)) {
      return;
    }
    const updatedTags = [...activeTags];

    updatedTags.push(innerText)

    setActiveTags(updatedTags);
    resetSearch();

  }


  const suggestionsList = filteredSuggestions.map((suggestion, idx) => {

    const activeItem = activeIdx === idx ? styles.activeSuggestion : ""

    return (
      <div key={`suggestion-${idx + 1}`}
        id={`suggestion-${idx + 1}`}>
        <p onClick={
          (e) => {
            setActiveIdx(idx);
            handleClick(e);
          }}
          className={[
            activeItem,
            styles.itemDecoration,
            styles.itemText,
          ].join(" ")}>
          <TagChip tag={suggestion} activeTags={filteredSuggestions} setActiveTags={setActiveTags} type="add" idx={idx}></TagChip>
        </p>
      </div>
    )
  })


  return (
    <div id="suggestions-list-container"
      className={[
        styles.listContainerStyle,
      ].join(" ")}>
      <div id="suggestions-list"
        className={[
          styles.listAlign,
        ].join(" ")}>
        {suggestionsList}
      </div>
    </div>
  )
}

interface TagChipProps {
  tag: string
  activeTags: string[]
  setActiveTags: Dispatch<SetStateAction<string[]>>
  type: "add" | "remove"
  idx: number
}

function TagChip(props: TagChipProps) {

  const { tag, activeTags, setActiveTags, idx, type } = props;

  function handleClick() {
    // const updatedTags = [...activeTags];
    let updatedTags: string[];
    switch (type) {
      case "remove":
        updatedTags = activeTags.filter(item => item !== tag);

        setActiveTags(updatedTags);
        break;
      case "add":
        updatedTags = [...activeTags];
        updatedTags.push(tag);

        setActiveTags(updatedTags);
        break;
    }
  }

  return (
    <div key={`tag-chip-${idx + 1}`}
      id={`tag-chip-${idx + 1}`}
      onClick={handleClick}
      className={[
        styles.tagChipSize,
        styles.tagChipDecorate,
        styles.tagChipColor,
        styles.tagChipAlign,
        animations.highlightPrimary,
      ].join(" ")}>
      <p>{tag}</p>
      <div className={[
        styles.tagButton
      ].join(" ")}>
        {type === "remove" ? <DeleteIcon /> : <AddIcon />}
      </div>
    </div>
  )
}

interface AutocompleteProps {
  feedbackForm: FeedbackForm
  setFeedbackForm: Dispatch<SetStateAction<FeedbackForm | undefined>>
  activeTags: string[]
  setActiveTags: Dispatch<SetStateAction<string[]>>
}

export default function Autocomplete(props: AutocompleteProps) {

  const { activeTags, setActiveTags } = props;

  const { tags } = useTagStore();

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState<number>(NaN);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectSuggestion, setSelectSuggestion] = useState<boolean>(false);

  const [tagInput, setTagInput] = useState<string>("");


  function searchTags(input: string) {

    const suggestions: string[] = [];

    for (let tag in tags) {
      if (tag.includes(input)) {
        suggestions.push(tag);
      }
    };

    setFilteredSuggestions(suggestions);
  }

  const searchTagsDebounced = debounce(searchTags, 300)

  function handleAutocompleteChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value } = e.target;

    if (value.length) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    };

    setTagInput(value);
    searchTagsDebounced(value);

  }

  function handleSuggestionSelect(e: KeyboardEvent<HTMLInputElement>) {

    const { code } = e;

    switch (code) {
      // case
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        setSelectSuggestion(true);
        // console.log(activeSuggestionIdx, filteredSuggestions.length - 1);
        if (activeSuggestionIdx === filteredSuggestions.length - 1) return;
        if (Number.isNaN(activeSuggestionIdx)) {
          // console.log("setting active suggestion idx to 0")
          setActiveSuggestionIdx(0);
          return;
        }
        setActiveSuggestionIdx(activeSuggestionIdx + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        setSelectSuggestion(true);
        if (activeSuggestionIdx === 0) return;
        setActiveSuggestionIdx(activeSuggestionIdx - 1)
        break;
      case "Enter":
        e.stopPropagation();
        e.preventDefault();
        const updatedTags = [...activeTags];

        if (activeTags.includes(tagInput)) return;

        if (selectSuggestion && activeSuggestionIdx >= 0) {
          updatedTags.push(filteredSuggestions[activeSuggestionIdx]);
        } else if (!selectSuggestion || !activeSuggestionIdx) {
          updatedTags.push(tagInput);
        }
        setActiveTags(updatedTags)
        // setSelectSuggestion(false);
        // setTagInput("");
        resetSearch();
        break;
      case "Escape":
        setSelectSuggestion(false);
        setActiveSuggestionIdx(NaN);
        break;
      default:
        setSelectSuggestion(false);
        setActiveSuggestionIdx(NaN)
    }

  }

  function resetSearch() {
    // setActiveTags([]);
    setShowSuggestions(false);
    setSelectSuggestion(false);
    setTagInput("");
    setActiveSuggestionIdx(NaN);
  }

  // sub-components:
  const tagChips = activeTags.map((tag, idx) => {

    return (
      <TagChip key={`active-tag-chip-${idx + 1}`} tag={tag} activeTags={activeTags} setActiveTags={setActiveTags} idx={idx} type="remove" />
    )

  })


  return (
    <div id="autocomplete-wrapper">
      <div id="autocomplete-inner-box">
        <div id="selected-tag-chips"
          hidden={tagChips.length > 0 ? false : true}
          className={[
            styles.tagsContainer,
          ].join(" ")}>
          {tagChips}
        </div>
        <input id="autocomplete-input"
          type="text"
          autoComplete="off"
          onChange={handleAutocompleteChange}
          onKeyDown={handleSuggestionSelect}
          value={tagInput}
          placeholder="Press Enter or Select from Suggestions"
          className={[
            styles.inputSize,
          ].join(" ")} />
      </div>
      <div id="autocomplete-suggestions" hidden={!showSuggestions}>
        <SuggestionsList
          resetSearch={resetSearch}
          setActiveIdx={setActiveSuggestionIdx}
          filteredSuggestions={filteredSuggestions}
          activeIdx={activeSuggestionIdx}
          activeTags={activeTags}
          setActiveTags={setActiveTags}
        />
      </div>
    </div>
  )

}