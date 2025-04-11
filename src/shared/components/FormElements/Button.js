import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = props => {
  // Handle click events with optional preventDefault
  const handleClick = (e) => {
    if (props.onClick) {
      if (props.preventDefault) {
        e.preventDefault();
      }
      props.onClick(e);
    }
  };

  // Common button props
  const buttonProps = {
    className: `button button--${props.size || 'default'} ${props.inverse ?
      'button--inverse' : ''} ${props.danger ?
      'button--danger' : ''} ${props.className || ''}`,
    onClick: handleClick,
    disabled: props.disabled,
    style: props.style
  };

  if (props.href) {
    return (
      <a
        {...buttonProps}
        href={props.href}
        target={props.target}
        rel={props.rel}
      >
        {props.children}
      </a>
    );
  }

  if (props.to) {
    return (
      <Link
        {...buttonProps}
        to={props.to}
        exact={props.exact}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      {...buttonProps}
      type={props.type || 'button'}
    >
      {props.children}
    </button>
  );
};

export default Button;