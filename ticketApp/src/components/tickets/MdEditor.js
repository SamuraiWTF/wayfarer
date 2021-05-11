import ReactMde from "react-mde";
import * as Showdown from "showdown";
import { useState } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";


const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

const MdEditor = ({ defaultValue, onSave, onCancel }) => {
  const [value, setValue] = useState(defaultValue);
  const [selectedTab, setSelectedTab] = useState("write");
  return (
    <div className="container">
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={markdown =>
          Promise.resolve(converter.makeHtml(markdown))
        }
      />
      <button className="button is-link" onClick={() => {onSave(value)}}>Save</button>
      <button className="button is-primary" onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default MdEditor;