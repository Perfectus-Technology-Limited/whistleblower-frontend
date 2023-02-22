import React from 'react'
import { Input } from "antd";

function SearchBar({ setSearchKey }) {

  const { Search } = Input
  const onSearch = (query) => {
    setSearchKey(query)
  }
  return (
    <Search
      placeholder="Search Keywords ..."
      onSearch={onSearch}
      enterButton
      size="large"
    />
  )
}

export default SearchBar