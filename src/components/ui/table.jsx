import React from "react";

export const Table = ({ className, ...props }) => (
  <table
    className={`w-full caption-bottom text-sm ${className || ""}`}
    {...props}
  />
);

export const TableHeader = ({ className, ...props }) => (
  <thead className={`[&_tr]:border-b ${className || ""}`} {...props} />
);

export const TableBody = ({ className, ...props }) => (
  <tbody
    className={`[&_tr:last-child]:border-0 ${className || ""}`}
    {...props}
  />
);

export const TableFooter = ({ className, ...props }) => (
  <tfoot
    className={`border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 ${
      className || ""
    }`}
    {...props}
  />
);

export const TableRow = ({ className, ...props }) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${
      className || ""
    }`}
    {...props}
  />
);

export const TableHead = ({ className, ...props }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${
      className || ""
    }`}
    {...props}
  />
);

export const TableCell = ({ className, ...props }) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${
      className || ""
    }`}
    {...props}
  />
);

export const TableCaption = ({ className, ...props }) => (
  <caption
    className={`mt-4 text-sm text-muted-foreground ${className || ""}`}
    {...props}
  />
);
