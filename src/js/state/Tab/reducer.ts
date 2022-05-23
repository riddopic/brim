import {combineReducers} from "redux"
import {reducer as inspector} from "src/js/state/Inspector/reducer"
import brim from "../../brim"
import chart from "../Chart/reducer"
import columns from "../Columns/reducer"
import {reducer as layout} from "../Layout/reducer"
import logDetails from "../LogDetails/reducer"
import search from "../Search/reducer"
import searchBar from "../SearchBar/reducer"
import viewer from "../Viewer/reducer"
import {reducer as results} from "../Results/reducer"

const tabReducer = combineReducers({
  id: (state: string = brim.randomHash(), _) => state,
  search,
  searchBar,
  viewer,
  chart,
  columns,
  logDetails,
  layout,
  inspector,
  results,
})

export type TabReducer = typeof tabReducer

export default tabReducer
