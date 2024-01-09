import React from "react";
import PageTitle from "../components/Typography/PageTitle";
import { useState } from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Avatar,
  Button,
  Pagination,
} from "@windmill/react-ui";

import { EditIcon, TrashIcon } from "../icons";
import { useGlobalContext } from "../context/GlobalContext";
import ThemedSuspense from "../components/ThemedSuspense";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Articles = () => {
  const { articlesFromDB, articlesLoader, handleDeleteArticle } =
    useGlobalContext();

  const [pageTable2, setPageTable2] = useState(1);

  const [dataTable2, setDataTable2] = useState([]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = articlesFromDB?.length;

  // pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataTable2(
      articlesFromDB?.slice(
        (pageTable2 - 1) * resultsPerPage,
        pageTable2 * resultsPerPage
      )
    );
  }, [pageTable2, articlesFromDB]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  const handleOpenDeleteModal = (event) => {
    setShowDeleteModal(true);
    setArticleToDelete(event);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  };

  if (articlesLoader) {
    return <ThemedSuspense />;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle>Articles</PageTitle>

        <NavLink to="/app/create-article">
          <Button>Add Article</Button>
        </NavLink>
      </div>

      <Modal isOpen={showDeleteModal} onClose={handleCloseDeleteModal}>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the Article:{" "}
          {articleToDelete && articleToDelete.id}?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteArticle(articleToDelete.id);
              handleCloseDeleteModal();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>

              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable2.map((article, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={article.mainImg}
                      alt="article avatar"
                    />
                    <div>
                      <p className="font-semibold">{article.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {`${article.paragraphOne.substring(0, 35)}...`}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm">
                    {/* {new Date().toLocaleDateString()} */}
                    {article.date}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      tag={Link}
                      to={`edit-article/${article.id}`}
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => handleOpenDeleteModal(article)}
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default Articles;
