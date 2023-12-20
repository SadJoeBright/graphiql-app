import { useState } from 'react';
import LineCounter from '../LineCounter/LineCounter';
import Button from '../UI/Button';
import chevronIcon from '../../assets/icons/chevron-icon.svg';
import { manageCursor } from '../../utils/manageCursor';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setVariables } from '../../store/variables-slice';
import { setHeaders } from '../../store/headers-slice';

function VariableHeaderEditor() {
  enum Tabs {
    NONE,
    VARIABLES,
    HEADERS,
  }

  const headers = useSelector((state: RootState) => state.headers.headers);
  const [headersCurrentValue, setHeadersCurrentValue] = useState(headers);

  const variables = useSelector((state: RootState) => state.variables.variables);
  const [variablesCurrentValue, setVariablesCurrentValue] = useState(variables);

  const [activeTab, setActiveTab] = useState(
    Number(window.localStorage.getItem('headersVariablesActiveTab')) || Tabs.NONE
  );
  const [isFocused, setIsFocused] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  const handleHeadersChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setHeadersCurrentValue(value);
    dispatch(setHeaders(value));
    window.localStorage.setItem('headers', value);
  };

  const handleVariablesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setVariablesCurrentValue(value);
    dispatch(setVariables(value));
    window.localStorage.setItem('variables', value);
  };

  const changeActiveTab = (tab: Tabs) => {
    window.localStorage.setItem('headersVariablesActiveTab', tab.toString());
    setActiveTab(tab);
  };

  return (
    <section className="flex flex-col py-2">
      <div className="flex justify-between gap-10 px-5 pt-2 border-t-2 bg-medium border-light">
        <div className="flex items-center gap-5">
          <div className={`${activeTab === Tabs.VARIABLES && 'underline'}`}>
            <Button onclick={() => changeActiveTab(Tabs.VARIABLES)} text="Variables" />
          </div>

          <div className={` ${activeTab === Tabs.HEADERS && 'underline'}`}>
            <Button onclick={() => changeActiveTab(Tabs.HEADERS)} text="Headers" />
          </div>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${
            activeTab !== Tabs.NONE && 'rotate-180'
          }`}
        >
          <Button
            onclick={() => changeActiveTab(activeTab === Tabs.NONE ? Tabs.VARIABLES : Tabs.NONE)}
            icon={chevronIcon}
          />
        </div>
      </div>
      <div
        className={`flex scale-y-0 -my-6 p-0 transition-scale duration-500 ease-in-out overflow-hidden ${
          activeTab !== Tabs.NONE && 'my-0 scale-y-100'
        }`}
      >
        <div className={`${activeTab === Tabs.NONE && 'h-0 overflow-hidden'}`}>
          <LineCounter
            value={activeTab === Tabs.HEADERS ? headersCurrentValue : variablesCurrentValue}
          />
        </div>
        <textarea
          autoFocus
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={activeTab === Tabs.HEADERS ? handleHeadersChange : handleVariablesChange}
          onKeyDown={(event) =>
            manageCursor(
              event,
              isFocused,
              activeTab === Tabs.HEADERS ? setHeadersCurrentValue : setVariablesCurrentValue
            )
          }
          name="editor"
          value={activeTab === Tabs.HEADERS ? headersCurrentValue : variablesCurrentValue}
          className="w-full px-2 overflow-hidden bg-medium outline-none resize-none font-mono"
        ></textarea>
      </div>
    </section>
  );
}

export default VariableHeaderEditor;
