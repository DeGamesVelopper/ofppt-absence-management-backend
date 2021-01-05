
import { Add, Delete, Edit, FetchData, GoToIndex } from './FunHelpers';

import {
   DATA_RECEIVED, FILIERE_ADDING_ERROR,UPDATE_ERROR, PREVIOUS_10_ROWS, NEXT_10_ROWS,TEN_ROWS_OF_COLLECTION,
  DATA_REFRESHED,FIRST_10_ROWS,FILIERE_PROCESSING,FILTER_FILIERE,FILTER_END
 } 
 from './TYPES';


// Actions
const fetchFilieres = (showLoading=true) => async(dispatch) =>{
    await dispatch(FetchData('api/admin/filieres',DATA_RECEIVED,showLoading))
}

const getFilieres =({firstIndex, lastIndex})=> async(dispatch,getState)=> {
    const filtering = getState().flrStore.filtering
    const collection = !filtering ? getState().flrStore.collection: getState().flrStore.filteredFilieres
    await dispatch(GoToIndex(collection,firstIndex,lastIndex,TEN_ROWS_OF_COLLECTION))
}

const getNextRows = ({firstIndex,lastIndex,COLLECTION_LENGTH}) => 
 async (dispatch) =>{
    if (lastIndex < COLLECTION_LENGTH) {
      dispatch({
        type : NEXT_10_ROWS,
        firstIndex,
        lastIndex
      })
    }
}

const getPrevRows = ({firstIndex,lastIndex}) => 
 async (dispatch) =>{
    if (firstIndex > 0) {
      dispatch({
        type : PREVIOUS_10_ROWS,
        firstIndex,
        lastIndex
      })
    }
}

const addFiliere = ({data,firstIndex,lastIndex}) => async(dispatch,getState) =>{
  const collection = getState().flrStore.collection
  const actions={
    PROCCESSING: FILIERE_PROCESSING,
    ERROR : FILIERE_ADDING_ERROR,
    REFRESHED : DATA_REFRESHED
  }
  dispatch({type: FILIERE_PROCESSING })
  await dispatch(Add('api/admin/addfiliere',data,collection,actions))
  dispatch(getFilieres({firstIndex,lastIndex}))
}

const editFiliere = ({data,firstIndex,lastIndex}) => async(dispatch,getState) =>{

  const collection = getState().flrStore.collection
  const actions={
    PROCCESSING: FILIERE_PROCESSING,
    ERROR : UPDATE_ERROR,
    REFRESHED : DATA_REFRESHED
  }
  await dispatch(Edit(`api/admin/updatefiliere/${data.id}`,data,collection,actions))
  dispatch(getFilieres({firstIndex,lastIndex}))
}

const deleteFiliere = ({id,firstIndex,lastIndex}) => async(dispatch,getState) => {
  
  const collection = getState().flrStore.collection
  const actions={
    PROCCESSING: FILIERE_PROCESSING,
    ERROR : FILIERE_ADDING_ERROR,
    REFRESHED : DATA_REFRESHED
  }
  await dispatch(Delete(`api/admin/deletefiliere/${id}`,collection,actions))
  dispatch(getFilieres({firstIndex,lastIndex}))

  //get first 10 rows if there aren't any rows left
  const filieres = getState().flrStore.filieres
  if (!filieres.length>0){
    return dispatch({
      type: FIRST_10_ROWS
    })
  }
}

const FilterFilieres = ({firstIndex,lastIndex,filtertext}) => async(dispatch,getState) =>{
  const collection = getState().flrStore.collection
  if (filtertext) {
    const filterdFlrs = collection.filter(flr =>
      (String(flr.abvname).toLowerCase()).startsWith(filtertext.toLowerCase()) 
      ||
      (String(flr.name).toLowerCase()).startsWith(filtertext.toLowerCase())
    )
    await dispatch({
      type : FILTER_FILIERE,
      data : filterdFlrs,
      length : filterdFlrs.length
    })
  }else{
    dispatch({
      type : FILTER_END,
      length : collection.length
    })
  }
  dispatch(getFilieres({firstIndex,lastIndex}))
}

export {
  fetchFilieres,
  getFilieres,
  editFiliere,
  deleteFiliere,
  addFiliere,
  getNextRows,
  getPrevRows,
  FilterFilieres
}