/* eslint-disable no-magic-numbers */
// import { LoadCarSettings } from "Sidenote/Car/CarForm/loader";
import React, { useState } from "react";
import ComplexForm from "./ComplexForm";
import CustomInputRender from "./CustomInputRender";
import DerivedStateForm from "./DerivedStateForm";
import HugeForm from "./HugeForm";

const Examples = () => {
  const [currentTab, setCurrentTab] = useState(1),
    [loading, setLoading] = useState(false),

    handleTabClick = (tabIndex : number ) => {
      setLoading(true); 
      setTimeout(() => {
        setCurrentTab(tabIndex);
        setLoading(false); 
      }, 50);
    };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-3">
          <h3 className="mb-2">Examples</h3>
          <div className="nav flex-column nav-pills text-start" id="v-pills-tab" role="tablist">
            <button
              className={`nav-link ${currentTab === 1 ? "active" : ""}`}
              disabled={loading}
              onClick={() => handleTabClick(1)}
              role="tab"
              type="button">
                Derived state
            </button>
            <button
              className={`nav-link ${currentTab === 2 ? "active" : ""}`}
              disabled={loading}
              onClick={() => handleTabClick(2)}
              role="tab"
              type="button">
                Custom Input Render
            </button>
            <button
              className={`nav-link ${currentTab === 3 ? "active" : ""}`}
              disabled={loading}
              onClick={() => handleTabClick(3)}
              role="tab"
              type="button">
                Complex Form
            </button>
            <button
              className={`nav-link ${currentTab === 4 ? "active" : ""}`}
              disabled={loading}
              onClick={() => handleTabClick(4)}
              role="tab"
              type="button">
                Large form with 2000 fields
            </button>
          </div>
        </div>
        <div className="col-9">
          {loading ? (
            <div className="text-center mt-5">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="tab-content" id="v-pills-tabContent">
              {currentTab === 1 ? (
                <div className="tab-pane fade show active" role="tabpanel">
                  <DerivedStateForm />
                </div>
              ) : null}
              {currentTab === 2 ? (
                <div className="tab-pane fade show active" role="tabpanel">
                  <CustomInputRender />
                </div>
              ) : null}
              {currentTab === 3 ? (
                <div className="tab-pane fade show active" role="tabpanel">
                  <ComplexForm />
                </div>
              ) : null}
              {currentTab === 4 ? (
                <div className="tab-pane fade show active" role="tabpanel">
                  <HugeForm />
                </div>
              ) : null}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Examples;
