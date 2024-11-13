import { ChangeEvent, KeyboardEvent, Dispatch, SetStateAction, useState, act } from "react";
import styles from "./Autocomplete.module.css"
import debounce from "@/utils/debounce";
import { useTagStore } from "@/src/stores/tagStore";
import { FeedbackForm } from "components/practice/Practice.feedback";

/** 
 * Should take in a list of suggestions
 */


interface SuggestionsListProps {
  filteredSuggestions: string[]
  activeIdx: number
  setActiveIdx: Dispatch<SetStateAction<number>>
}

function SuggestionsList(props: SuggestionsListProps) {

  const { filteredSuggestions, activeIdx, setActiveIdx } = props;

  const suggestionsList = filteredSuggestions.map((suggestion, idx) => {

    const activeItem = activeIdx === idx ? styles.activeSuggestion : ""

    return (
      <p key={`suggestion-${idx + 1}`}
        id={`suggestion-${idx + 1}`}
        onClick={() => {
          setActiveIdx(idx)
        }}
        className={[
          activeItem,
          styles.itemDecoration,
          styles.itemText,

        ].join(" ")}>
        {suggestion}
      </p>
    )

  })


  return (
    <div id="suggestions-list-box"
      className={[
        styles.listContainer,
      ].join(" ")}>
      <div id="suggestions-list">
        {suggestionsList}
      </div>
    </div>
  )

}

interface AutocompleteProps {
  feedbackForm: FeedbackForm
  setFeedbackForm: Dispatch<SetStateAction<FeedbackForm | undefined>>
}

export default function Autocomplete(props: AutocompleteProps) {

  const { feedbackForm, setFeedbackForm } = props;

  const { tags, addTag } = useTagStore();

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState<number>(NaN);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>("");

  function searchTags(input: string) {

    const suggestions: string[] = [];

    for (let tag in tags) {
      if (tag.includes(input)) {
        suggestions.push(tag);
      }
    };

    console.log("searchTags/suggestions: ", suggestions);

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
    const updatedFeedbackForm = structuredClone(feedbackForm);
    console.log("suggestionsSelect/code: ", code);
    switch (code) {
      // case
      case "ArrowDown":
        e.preventDefault();
        if (activeSuggestionIdx === filteredSuggestions.length - 1) return;
        if (Number.isNaN(activeSuggestionIdx)) {
          setActiveSuggestionIdx(0);
        }
        setActiveSuggestionIdx(activeSuggestionIdx + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (activeSuggestionIdx === 0) return;
        setActiveSuggestionIdx(activeSuggestionIdx - 1)
        break;
      case "Enter":
        e.preventDefault();
        if (filteredSuggestions[activeSuggestionIdx]) {

          updatedFeedbackForm.tags.push(tags[filteredSuggestions[activeSuggestionIdx]]);

          setFeedbackForm(updatedFeedbackForm);

        } else {
          handleAddNewTag();
        }
        break;
      case "Delete":
        if (!tagInput.length) {

          updatedFeedbackForm.tags.pop();
          setFeedbackForm(updatedFeedbackForm);

        }
        break;
      case "Escape":
        setActiveSuggestionIdx(NaN);
    }

  }

  async function handleAddNewTag() {

    const data = await addTag(tagInput);

    const updatedFeedbackForm = structuredClone(feedbackForm);

    updatedFeedbackForm.tags.push(data);

    setFeedbackForm(updatedFeedbackForm);

  }

  // sub-components:
  const tagChips = feedbackForm.tags.map((id, idx) => {

    console.log("tagChips: id", id)

    return (
      <div key={`tag-chip-${idx + 1}`}>
        <p>{tags[id]}</p>
      </div>
    )

  })


  return (
    <div id="autocomplete-wrapper">
      <div id="autocomplete-inner-box">
        <div id="selected-tag-chips" hidden={tagChips.length > 0 ? false : true}>
          {tagChips}
        </div>
        <input id="autocomplete-input"
          type="text"
          onChange={handleAutocompleteChange}
          onKeyDown={handleSuggestionSelect}
          value={tagInput}
          className={[
            styles.inputSize,
          ].join(" ")} />
      </div>
      <div id="autocomplete-suggestions" hidden={!showSuggestions}>
        <SuggestionsList
          setActiveIdx={setActiveSuggestionIdx} filteredSuggestions={filteredSuggestions}
          activeIdx={activeSuggestionIdx} />
      </div>
    </div>
  )

}