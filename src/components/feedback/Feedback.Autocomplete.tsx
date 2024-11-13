import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import debounce from "@/utils/debounce";
import { useTagStore } from "@/src/stores/tagStore";
import { FeedbackForm } from "components/practice/Practice.feedback";

/** 
 * Should take in a list of suggestions
 */


interface SuggestionsListProps {
  filteredSuggestions: string[]
  activeIdx: number
}

function SuggestionsList(props: SuggestionsListProps) {

  const { filteredSuggestions, activeIdx } = props;

  const suggestionsList = filteredSuggestions.map((suggestion, idx) => {

    return (
      <li key={`suggestion-${idx + 1}`}>

      </li>
    )

  })


  return (
    <div>
      <ul>

      </ul>
    </div>
  )

}

interface AutocompleteProps {
  setFeedbackForm: Dispatch<SetStateAction<FeedbackForm | undefined>>
}

export default function Autocomplete(props: AutocompleteProps) {

  const { tags, getTags } = useTagStore();

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState<number>(0);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
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

    searchTagsDebounced(value);

  }


  return (
    <div>
      <input type="text" onChange={handleAutocompleteChange} />
    </div>
  )

}