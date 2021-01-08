import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import PopUpModal from "../Modals/PopUpModal";
import ConfirmModal from "../Modals/ConfirmDeletionModal";
import SearchInput from "../Controls/CustomInput";
import Table from "../Controls/Table";

import PageLoading from "../Controls/Loading/pageLoading";
import { AddIcon } from "../../Icons";

import "./CRUD.css";
import CustomInput from "../Controls/CustomInput";

const CRUD = ({
  _STATE,
  FETCHDATA,
  NEW,
  EDIT,
  DELETE,
  SEARCH,
  TABLE_DATA,
  LOADING,
}) => {
  // extern states
  const { _Value, _SetValue } = _STATE;
  const { Create_Modal_title, AddObject, Create_Inputs } = NEW;
  const { Update_Modal_title, EditObject } = EDIT;
  const { SearchPlaceholeder, FilterCollection } = SEARCH;
  const { isloading, onCRUDAction } = LOADING;
  const {
    Collection,
    Headers,
    COLLECTION_LENGTH,
    CurrentIndex,
    Get_Ten_Rows,
    Next_Ten_Rows,
    Previous_Ten_Rows,
  } = TABLE_DATA;

  // loacl state
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [ID, setID] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (Collection?.length === 0) {
      const fetchData = async () => {
        await dispatch(FETCHDATA());
        await dispatch(Get_Ten_Rows(CurrentIndex));
        setData(Collection);
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    dispatch(Get_Ten_Rows(CurrentIndex));
  }, [dispatch, CurrentIndex, Get_Ten_Rows]);

  useEffect(() => {
    setData(Collection);
  }, [Collection]);

  const getNext10Row = () => {
    dispatch(Next_Ten_Rows({ ...CurrentIndex, COLLECTION_LENGTH }));
  };

  const getPrev10Row = () => {
    dispatch(Previous_Ten_Rows(CurrentIndex));
  };

  const filter = () => {
    dispatch(FilterCollection({ ...CurrentIndex, filtertext: searchInput }));
  };

  const handleEdit = () => {
    if (_Value) {
      setSearchInput("");
      const data = {
        id: ID,
        ..._Value,
      };
      dispatch(EditObject({ data, ...CurrentIndex }));
      _SetValue({});
      setID("");
      return true;
    } else return false;
  };

  const handleDelete = id => {
    setSearchInput("");
    dispatch(DELETE({ id, ...CurrentIndex }));
    setID("");
  };

  const handleAdd = () => {
    if (_Value) {
      dispatch(AddObject({ data: _Value, ...CurrentIndex }));
      _SetValue({});
      return true;
    } else return false;
  };

  const OpenUpdateModal = id => {
    setShowUpdateModal(true);
    const obj = Collection.find(col => col._id === id);
    setID(obj._id);
    _SetValue({ ...obj });
  };

  const OpenDeleteModal = id => {
    setShowConfirmModal(true);
    setID(id);
  };

  const CloseModal = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setShowConfirmModal(false);
    setID("");
    _SetValue({});
  };

  return (
    <>
      {
        /* create or update*/
        showCreateModal || showUpdateModal ? (
          <PopUpModal
            customizeInput="createModal__Input"
            title={showCreateModal ? Create_Modal_title : Update_Modal_title}
            sumbitButton={showCreateModal ? "Ajouter" : "Changer"}
            cancelButton="Annuler"
            DoAction={showCreateModal ? () => handleAdd() : () => handleEdit()}
            close={() => CloseModal()}
          >
            {Create_Inputs.map(input => (
              <CustomInput
                className="createModal__Input"
                key={input.keyValue}
                placeholder={input.placeholder}
                value={input.value}
                setValue={input.setValue}
              />
            ))}
          </PopUpModal>
        ) : /* delete */
        showConfirmModal ? (
          <ConfirmModal
            text="Voulez-vous vraiment supprimer ce filiere?"
            Delete={() => handleDelete(ID)}
            Close={() => CloseModal()}
          />
        ) : null
      }
      {isloading ? (
        <PageLoading className="CRUD__loading" />
      ) : (
        <div className="CRUD__content">
          {/* search and add new */}
          <div className="CRUD__search__add">
            {/* add */}
            <AddIcon
              onClick={() => setShowCreateModal(true)}
              className="Icon CRUD__content__addIcon"
            />
            {/* custom input */}
            <SearchInput
              className="CRUD__Input"
              value={searchInput}
              setValue={setSearchInput}
              placeholder={SearchPlaceholeder}
              search={true}
              filter={filter}
            />
          </div>
          {/* table */}
          <Table
            collection={data}
            onCRUDAction={onCRUDAction}
            headers={Headers}
            OpenDeleteModal={OpenDeleteModal}
            OpenUpdateModal={OpenUpdateModal}
            COLLECTION_LENGTH={COLLECTION_LENGTH}
            CurrentIndex={CurrentIndex}
            Next={() => getNext10Row()}
            Previous={() => getPrev10Row()}
          />
        </div>
      )}
    </>
  );
};

export default CRUD;
