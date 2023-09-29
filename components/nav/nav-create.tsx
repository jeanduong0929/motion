import Link from 'next/link';
import React from 'react'
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';

/**
 * Navigation component for the create todo page.
 * @returns {JSX.Element} - The rendered component.
 */
const NavCreate = (): JSX.Element => {
  return (
    <>
      <nav className="flex items-center justify-between px-10 py-5">
        <div>
          <Link href={"/dashboard"}>
            {/* Corrected the usage of Link component */}
            <Button variant={"ghost"}>
              <ChevronLeft size={20} className="mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </nav>
    </>
  );
};


export default NavCreate
