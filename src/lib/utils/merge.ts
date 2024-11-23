import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const mergeClass = (...otherClass: any[]) => twMerge(clsx(...otherClass));

export default mergeClass;
