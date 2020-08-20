import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useCurrentUser } from './AuthProvider';
import { NullableUser } from '../Types';

interface PropTypes {
  className?: string;
}

export default function Share(props: PropTypes) {
  const { className = '' } = props;

  const user: NullableUser = useCurrentUser();

  const isProfileComplete: boolean = user?.fullName && user.urlShortName ? true : false;

  return (
    <div className={classNames('bg-yellow-100 rounded p-4 border-yellow-200 border mt-4', className)}>
      {isProfileComplete && (
        <div className="flex flex-col">
          <p className="text-base text-indigo-900 mb-4">Share Your Wish list with those who care :)</p>
          <input className="c-input" readOnly value={`${process.env.NEXT_PUBLIC_BASE_URL}/w/${user?.urlShortName}`} />
        </div>
      )}
      {!isProfileComplete && (
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <p className="text-base text-indigo-900 mb-4 md:mb-0">
            Complete your profile and Share Your Wish list with those who care :)
          </p>
          <Link href="/profile">
            <a className="uppercase text-base font-semibold text-indigo-900 self-center">Complete Profile</a>
          </Link>
        </div>
      )}
    </div>
  );
}
