import React from 'react';
import Star from './Star';
import { useCurrentUser } from './AuthProvider';
import Link from 'next/link';
import classNames from 'classnames';
import DropDown from './DropDown';
import LogoutBtn from './LogoutBtn';

interface PropTypes {
  className?: string;
  floatHeader?: boolean;
}

export default function Header(props: PropTypes) {
  const { className, floatHeader = false } = props;

  const user = useCurrentUser();

  const isLoggedin = !!user;

  return (
    <header
      className={classNames('flex flex-row bg-indigo-900 p-4 text-yellow-400 justify-between', className, {
        'absolute inset-x-0 top-0 bg-opacity-25': floatHeader,
      })}
    >
      <Link href="/">
        <a className="flex flex-row items-center">
          <Star className="text-yellow-400 w-5" />
          <h1 className="text-yellow-400 pl-1 text-bold text-lg uppercase">Wish App</h1>
        </a>
      </Link>
      <div className="flex flex-row items-center">
        {!isLoggedin && (
          <DropDown btnText="Create Your Wish list">
            <Link href="/register">
              <a className="block px-4 py-2 font-extrabold">Create Your Wish list</a>
            </Link>
            <Link href="/">
              <a className="block px-4 py-2">Home</a>
            </Link>
            <Link href="/login">
              <a className="block px-4 py-2">Login</a>
            </Link>
          </DropDown>
        )}
        {isLoggedin && (
          <DropDown btnText={`Hey, ${user?.fullName || user?.email}`}>
            <Link href="/">
              <a className="block px-4 py-2">Home</a>
            </Link>
            <Link href="/wishes">
              <a className="block px-4 py-2">Your Wishes</a>
            </Link>
            <Link href="/profile">
              <a className="block px-4 py-2">Profile/Settings</a>
            </Link>
            <LogoutBtn className="block px-4 py-2" />
          </DropDown>
        )}
      </div>
    </header>
  );
}
