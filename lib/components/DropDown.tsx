import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import ExpandIcon from './ExpandIcon';

interface PropTypes {
  btnText: string;
  children: JSX.Element[] | JSX.Element;
}

export default function DropDown(props: PropTypes) {
  const { children, btnText } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];

    const handler = () => {
      setIsOpen(false);
    };

    body.addEventListener('click', handler);

    return () => {
      body.removeEventListener('click', handler);
    };
  }, [isOpen]);

  return (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <button
        type="button"
        className="flex flex-row items-center text-sm h-10"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {btnText}
        <ExpandIcon className="w-5 inline" containerClassName="" />
      </button>
      <div
        className={classNames(
          'absolute w-48 top-0 right-0 mt-10 bg-white rounded text-indigo-900 text-base shadow-lg',
          { hidden: !isOpen },
        )}
        onClick={(e) => {
          setIsOpen(false);
        }}
      >
        {children}
      </div>
    </div>
  );
}
