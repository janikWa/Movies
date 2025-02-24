import { Button, ButtonGroup } from "@mui/material";

const Pagination = ({ totalPages, page, onChange }) => {
    const maxPageNumbers = 5; 

    let startPage = Math.max(1, page - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (endPage - startPage < maxPageNumbers - 1) {
        startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <ButtonGroup variant="outlined" aria-label="Pagination">
            {page > 1 && (
                <Button onClick={() => onChange(page - 1)}>« Prev</Button>
            )}
            {pageNumbers.map((number) => (
                <Button
                    key={number}
                    onClick={() => onChange(number)}
                    color={number === page ? "primary" : "inherit"}
                >
                    {number}
                </Button>
            ))}
            {page < totalPages && (
                <Button onClick={() => onChange(page + 1)}>Next »</Button>
            )}
        </ButtonGroup>
    );
};

export default Pagination;

