import React from 'react';
import classNames from 'classnames';

interface PropTypes {
  containerClassName?: string;
  className?: string;
  fill?: boolean;
}

export default function Star(props: PropTypes) {
  const { containerClassName, className, fill } = props;

  return (
    <div className={containerClassName}>
      {fill && (
        <svg
          className={classNames('fill-current', className)}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 768 768"
        >
          <path d="M384 552l-198 120 52.5-225-174-151.5 229.5-19.5 90-211.5 90 211.5 229.5 19.5-174 151.5 52.5 225z"></path>
        </svg>
      )}
      {!fill && (
        <svg
          className={classNames('fill-current', className)}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 768 768"
        >
          <path d="M384 493.5l120 72-31.5-136.5 106.5-93-141-12-54-129-54 129-141 12 106.5 93-31.5 136.5zM703.5 295.5l-174 151.5 52.5 225-198-120-198 120 52.5-225-174-151.5 229.5-19.5 90-211.5 90 211.5z"></path>
        </svg>
      )}
    </div>
  );
}
