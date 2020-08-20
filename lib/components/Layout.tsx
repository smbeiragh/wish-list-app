import React from 'react';
import classNames from 'classnames';
import Header from './Header';

interface PropTypes {
  children: JSX.Element[] | JSX.Element;
  className?: string;
  floatHeader?: boolean;
}

function Layout(props: PropTypes) {
  const { children, className, floatHeader = false } = props;

  return (
    <div className={classNames(className)}>
      <Header floatHeader={floatHeader} />
      {children}
    </div>
  );
}

function Container(props: PropTypes) {
  const { children, className } = props;

  return <div className={classNames('container mx-auto px-4', className)}>{children}</div>;
}

export { Layout, Container };
