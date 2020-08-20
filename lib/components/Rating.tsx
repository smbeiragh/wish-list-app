import React, { useState } from 'react';
import classNames from 'classnames';
import Star from './Star';

interface PropTypes {
  onChange?(value: number): void;
  defaultValue?: number;
  value?: number;
  readOnly?: boolean;
  className?: string;
}

const items: number[] = [1, 2, 3, 4, 5];

export default function Rating(props: PropTypes) {
  const { defaultValue, value = 0, onChange, className, readOnly = false } = props;

  const [hoverIndex, setHoverIndex] = useState<number>(-1);

  function handleChange(value: number) {
    if (onChange && !readOnly) {
      onChange(value);
    }
  }

  const BtnComp = readOnly ? 'div' : 'button';

  return (
    <div className={classNames(className, 'flex flex-row')} onMouseLeave={() => setHoverIndex(-1)}>
      {items.map((item) => (
        <BtnComp
          key={item}
          {...(readOnly ? {} : { type: 'button' })}
          onMouseEnter={() => setHoverIndex(item)}
          onClick={() => handleChange(item)}
        >
          <Star
            fill={(!readOnly && item <= hoverIndex) || (value ? item <= value : false)}
            className="text-yellow-600"
            containerClassName="w-6 h-6"
          />
        </BtnComp>
      ))}
    </div>
  );
}
