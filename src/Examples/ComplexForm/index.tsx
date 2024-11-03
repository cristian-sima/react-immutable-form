/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
// import { JSONSyntaxFromData } from "Sidenote/Common/Syntax";

import { JSONSyntaxFromData } from "Sidenote/core/Common/Syntax";
import { FormPrompt } from "Sidenote/core/store/store";
import Immutable, { List } from "immutable";
import React, { useCallback, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { LoadingMessage } from "x25/Messages";
import { notify, notifyError, notifyWarning } from "x25/actions";
import { validateDate, validateFloat, validateSelect } from "x25/utility";
import { ImmutableField, ImmutableFieldRenderer, ImmutableForm, ImmutableFormArray, ImmutableFormContext, immutableGetters } from "../..";
import { DateInput, DateTemplate, InputTemplate, NumericInput, NumericTemplate, SelectTemplate, SimpleInput, SimpleSelect, SimpleTextarea, SwitchInput, TextareaTemplate, onErrors } from "../../../src";
import { HandleChangeFunc, ImmutableFieldProps, ImmutableFormDecorators, RemoveArrayFunc, onSubmitImmutableFormErrorFunc, onSubmitImmutableFormFunc } from "../../types";
import ImmutableFormJSON from "../_helpers/ImmutableFormJSON";

type TableRowProps = {
  readonly current: Immutable.Map<string, any>;
  readonly ID: string;
  readonly index: number;
  readonly listName: string;
  readonly remove: RemoveArrayFunc;
}

type FormInnerProps = {
  readonly formError: string;
  readonly isSubmitting: boolean;
  readonly hide: boolean; 
  readonly nameInput: React.RefObject<HTMLInputElement>;
  readonly formState: Immutable.Map<string, any>
  readonly setField: HandleChangeFunc;
  readonly focus: () => any;
  readonly toggle: () => any;
  readonly toggleJSONSource: () => any;
}

const 

  isFloat = (raw: string) => {
    const floatRegex = /^-?\d+(?:[.]\d*?)?$/u;

    return floatRegex.test(raw);
  },
  isNumeric = (valueToCheck : any) => (
    valueToCheck !== "" && isFloat(valueToCheck) && typeof valueToCheck === "string"
  ),
  NR_OF_ROWS = 3,
  itemsListName = "Items",
  TableDetails = () => {
    const
      { handleArrayAdd, formState } = useContext(ImmutableFormContext);

    return (
      <>
        <span className="badge text-bg-primary">
          {"Items: "}
          { (formState.getIn([itemsListName]) as any).size as number }
        </span>
        <button
          className="btn btn-success ms-1"
          onClick={() => handleArrayAdd(itemsListName, Immutable.Map({
            Name    : "cristina",
            Surname : "water",
          }))}
          type="button">
          {"+"}
        </button>
      </>
    );
  },
  TableRowInner = ({ ID, index, listName, remove }: TableRowProps) => {
    const 
      renderCount = useRef(0),
      rowProps = React.useMemo(() => ({
        listName,
        ID,
        index,
      } as ImmutableFieldProps<HTMLInputElement>), [ID, listName, index]);

    React.useEffect(() => {
      renderCount.current += 1;
    });

    return (
      <tr key={ID}>
        <td key={`td-${ID}-nume`}>
          <ImmutableField
            {...rowProps}
            component={ImmutableFieldRenderer}
            name="Name"
          />
        </td>
        <td>
          <ImmutableField
            {...rowProps}
            component={ImmutableFieldRenderer}
            name="Surname" />
        </td>
        <td>
          <ImmutableField
            {...rowProps}
            component={ImmutableFieldRenderer}
            name="Age" />
        </td>
        <td>
          <ImmutableField
            {...rowProps}
            component={ImmutableFieldRenderer}
            name="Location" />
        </td>
        <td>
          <ImmutableField
            {...rowProps}
            component={ImmutableFieldRenderer}
            name="city" />
        </td>
        <td>
          <span className="badge text-bg-warning">{renderCount.current}</span>
          <button
            className="btn btn-danger"
            onClick={() => remove(listName, ID)}
            type="button">
            {"x"}
          </button>
        </td>
      </tr>
    );
  },
  TableRow = React.memo(TableRowInner),
  ItemsInner = () => (
    <ImmutableFormArray name={itemsListName}>
      {({ data, name: listName, remove }) => (
        <table>
          <thead>
            <tr>
              <th>
                  Name
              </th>
              <th>
                  Surname
              </th>
              <th>
              Age
              </th>
              <th>
              Location
              </th>
              <th>
              City
              </th>
            </tr>
          </thead>
          {/* <TransitionGroup component="tbody"> */}
          <tbody>
            {data.map((current, index) => {
              if (typeof current === "undefined") {
                return null;
              }
                
              const ID = current.get("ID");

              return (
                <TableRow
                  current={current}
                  ID={ID}
                  index={index}
                  key={ID}
                  listName={listName}
                  remove={remove} />
              );
            })}
          </tbody>
          {/* </TransitionGroup> */}
        </table>
      )}
    </ImmutableFormArray>
  ),
  Items = React.memo(ItemsInner),
  FormInner = (props : FormInnerProps) => {

    const 
      { focus, formError, isSubmitting, toggle, nameInput, hide, toggleJSONSource, setField } = props,
      inputTemplateProps = React.useMemo(() => Immutable.Map({
        label: "County",
      }), []),
      numericInputComponentProps = React.useMemo(() => Immutable.Map({
        currency  : "USD",
        precision : 4,
      }), []),
      numericTemplateProps = React.useMemo(() => (
        numericInputComponentProps.mergeDeep(Immutable.Map({
          label: "Total without tax",
        }))
      ), []),
      textareaTemplateProps = React.useMemo(() => Immutable.Map({
        label: "Country",
      }), []),
      switchInputProps = React.useMemo(() => Immutable.Map({
        label: "Is the record deleted?",
      }), []),
      checkboxInputProps = React.useMemo(() => Immutable.Map({
        label    : "Also checkbox",
        checkbox : true,
      }), []),
      simpleSelectProps = React.useMemo(() => Immutable.Map({
        isImmutable     : true, 
        showEmptyOption : true,
        valueKey        : "ID",
        nameKey         : "Name",
        list            : Immutable.List<Immutable.Map<string, any>>([
          Immutable.Map({
            ID   : 1,
            Name : "Cat",
          }),
          Immutable.Map({
            ID   : 2,
            Name : "Dog",
          }),
          Immutable.Map({
            ID   : 3,
            Name : "Fox",
          }),
        ]),
      }), []),
      selectTemplateProps = React.useMemo(() => (
        simpleSelectProps.mergeDeep(Immutable.Map({
          label: "Animal",
        }))
      ), []),

      dateTemplateProps = React.useMemo(() => Immutable.Map({
        label: "Birthday",
      }), []),

      taxTotalValue = (props.formState.getIn(["TaxTotal", "value"]) || 0) as number,
      currentAnimalID = (props.formState.getIn(["AnimalID", "value"]) || 1) as number;

    return (
      <>
        {formError ? (
          <div className="alert alert-danger">
            {formError}
          </div>
        ) : null}
        {isSubmitting ? <LoadingMessage /> : (
          <div className="container">
            <div className="row">
              <div className="col-auto">
                <button
                  className="btn btn-primary mx-1"
                  disabled={isSubmitting}
                  onClick={() => focus()}
                  type="button">
                  {"Focus first"}
                </button>
                <button
                  className="btn btn-primary mx-1"
                  disabled={isSubmitting}
                  type="submit">
                  {"Submit form"}
                </button>
                <button
                  className="btn btn-primary mx-1"
                  disabled={isSubmitting}
                  onClick={toggle}
                  type="button">
                  {"Toggle fields"}
                </button>
                <br /><br />
                {"Total"}
                <ImmutableField
                  inputProps={{ autoFocus: false, ref: nameInput }}
                  name="Total" />
                <br />
                {"Same field, multiple times:"}
                {hide ? null : (
                  <>
                    <ImmutableField name="Vat" />
                    <ImmutableField name="Vat" />
                    <ImmutableField name="Vat" />
                  </>
                )}

                <div>
                  <hr />
                  <h6>{"SimpleInput"}</h6>
                  <ul>
                    <li>
                      {"showing text feedback: "}
                      <ImmutableField component={SimpleInput} name="City" />
                    </li>
                    <li>
                      {"hiding text feedback: "}
                      <ImmutableField component={SimpleInput} hideError name="City" />
                    </li>
                  </ul>
                  <hr />
                  <h6>{"InputTemplate"}</h6>
                  <ImmutableField
                    component={InputTemplate}
                    componentProps={inputTemplateProps}
                    name="County" 
                  />
                </div>
                <div>
                  <hr />
                  <h6>{"NumericInput"}</h6>
                  <ul>
                    <li>
                      {"with currency: "}
                      <ImmutableField 
                        component={NumericInput}
                        componentProps={numericInputComponentProps}
                        name="TaxTotal"
                      />
                    </li>
                    <li>
                      {"without currency: "}
                      <ImmutableField 
                        component={NumericInput}
                        componentProps={numericInputComponentProps.delete("currency")}
                        name="TaxTotal"
                      />
                    </li>
                  </ul>
                  <button 
                    className="btn btn-primary btn-sm ms-1"
                    onClick={() => setField("TaxTotal", 200.06)}
                    type="button">
                    {"Set 200,06"}
                  </button>
                  <button 
                    className="btn btn-primary btn-sm ms-1"
                    onClick={() => setField("TaxTotal", taxTotalValue + 1)}
                    type="button">
                    {"Add 1 to TaxTotal"}
                  </button>
                  <button 
                    className="btn btn-primary btn-sm ms-1"
                    onClick={() => setField("TaxTotal", taxTotalValue - 1)}
                    type="button">
                    {"Subtract 1 from TaxTotal"}
                  </button>
                  <hr />
                  <h6>{"NumericTemplate"}</h6>
                  <ImmutableField
                    component={NumericTemplate}
                    componentProps={numericTemplateProps}
                    name="CarWithoutTotal" 
                  />
                </div>

                <div className="mt-1">
                  <h6>{"SimpleTextarea"}</h6>
                  <ImmutableField
                    component={SimpleTextarea}
                    name="Address" 
                  />
                  <h6>{"TextareaTemplate"}</h6>
                  <ImmutableField
                    component={TextareaTemplate}
                    componentProps={textareaTemplateProps}
                    name="Country" 
                  />
                </div>
                <hr />

                <div className="mt-1">
                  <h6>{"DateInput - integration with react-datepicker"}</h6>
                  <ImmutableField
                    component={DateInput}
                    name="CarDate" 
                  />
                  <h6>{"DateTemplate"}</h6>
                  <ImmutableField
                    component={DateTemplate}
                    componentProps={dateTemplateProps}
                    name="Birthday" 
                  />
                </div>

                <hr />
                <div className="mt-1">
                  <h6>{"SwitchInput"}</h6>
                  <ImmutableField
                    component={SwitchInput}
                    componentProps={switchInputProps}
                    name="IsDeleted" 
                  />
                  <ImmutableField
                    component={SwitchInput}
                    componentProps={checkboxInputProps}
                    name="IsDeleted" 
                  />
                </div>
                <hr />
                <div className="mt-1">
                  <h6>{"SimpleSelect"}</h6>
                  <ImmutableField
                    component={SimpleSelect}
                    componentProps={simpleSelectProps}
                    name="AnimalID" 
                  />
                  {`Current AnimalID: ${ currentAnimalID}`}
                  <button 
                    className="btn btn-primary btn-sm ms-1"
                    onClick={() => setField("AnimalID", currentAnimalID%3+1 )}
                    type="button">
                    {"Get the next animal"}
                  </button>
                  <h6>{"SelectTemplate"}</h6>
                  <ImmutableField
                    component={SelectTemplate}
                    componentProps={selectTemplateProps}
                    name="AnimalID" 
                  />
                </div>

                {/* <Field component={Black} name='paraschiv' /> */}
                <TableDetails />
                <Items />
              </div>
              <div className="col-6">
                <button
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  onClick={toggleJSONSource}
                  type="button">
                  {"Schimbă sursa"}
                </button>
              </div>

            </div>
          </div>
        )}
      </>
    );
  },
  InnerRenderSum = ({ data } : { readonly data : any}) => (
    <div>
      {"Total: "}
      <JSONSyntaxFromData data={data} />
    </div>
  ),
  RenderSum = React.memo(InnerRenderSum),
  ShowSum = () => {
    const 
      form = useContext(ImmutableFormContext);

    return (
      <RenderSum data={form.getFormData().get("computed")} />
    );
  },
  ComplexForm = () => {
    const      
      initialValues = Immutable.fromJS({
        Total           : "1",
        Vat             : "1",
        [itemsListName] : List(Array(NR_OF_ROWS).fill("").map((_value, index) => Immutable.Map({
          Name    : "Nea",
          Surname : `Caisa ${index}`,
        }))),
      }),

      atLeastChars = (nrOfChars :number) => (
        (value: any) => {
        // const paraschiv = formState.getIn(["paraschiv", "value"]);
    
          if (typeof value !== "string" || String(value).length < nrOfChars ) {
            return `At least ${nrOfChars} chars`;
          }
    
          return undefined;
        }
      ),
      initialValidators = Immutable.Map({
        "AnimalID"  : validateSelect({}),
        "IsDeleted" : (value : any) => value === true ? undefined : "Must check this",
        "CarDate"   : validateDate,
        "TaxTotal"  : validateFloat({
          min : 200,
          max : 10000,
        }),
        "Total" : atLeastChars(3),
        "City"  : (value : any) => (
          String(value).includes(",") ? undefined : "It must include a comma (,)"
        ),
        "Vat": (value : any) => {
          const 
            acceptedList = [5, 9, 19],
            isOk = acceptedList.includes(Number(value));

          if (isOk) {
            return undefined;
          }

          return `Must be ${acceptedList.join(" or ")}`;
        },
        [itemsListName]: Immutable.Map(
          {
            "Name"    : atLeastChars(3),
            "Surname" : atLeastChars(7),
            // "age"     : atLeastChars(2),
          },
        ),
      }),
      dispatch = useDispatch(),
      onSubmit : onSubmitImmutableFormFunc  = (values) => 
      {
        // eslint-disable-next-line no-console
        console.log("values.toJS()", values.toJS());


        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              if (Math.random() < 0.3) {
                throw new Error("Simulated error");
              }
              dispatch(notify("Trimis cu succes"));
              resolve();
            } catch (error) {
              dispatch(notifyError("Probleme cu rețeaua"));
              reject(error);
            }
          }, 2000);
        });
      },
      onSubmitError : onSubmitImmutableFormErrorFunc = useCallback((errors) => {
        const cb = (node : any) => dispatch(notifyWarning(node, { persistent: true }));
  
        return onErrors(cb)(errors);
      }, []),
      decorators : ImmutableFormDecorators = Immutable.Map({
        "Items.Age": ({ formData, nodes }) => {
          
          // console.group("Items.Age");
          // console.log("field", field);
          // console.log("formData", formData);
          // console.log("nodes", nodes);
          // console.log("value", value);
          // console.groupEnd("Items.Age");

          // todo create a special helper for iterating array 

          const 
            sumAges = () => {
              const 
                listName = String(nodes.first()),
                list = immutableGetters.getArray(formData, listName),
                newValue = list.reduce((reduction, row) => {
                  const
                    currentAge =  immutableGetters.getArrayRowFieldValue(row, "Age"),
                    numericAge = isNumeric(currentAge) ? parseFloat(String(currentAge)) : 0;

                  formData.updateIn(
                    ["computed", ...nodes, "NewAge"], 
                    (newAge : any = 0) => (newAge + 10) as any,
                  );

                  return reduction + numericAge;
                }, 0);

              return newValue;
            };
            
          formData.setIn(["computed", "sum"], sumAges());
        },
      });

    return (
      <ImmutableForm
        decorators={decorators}
        initialValidators={initialValidators}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}>
        {(form) => {
          const 
            [ hide, setHide ] = React.useState(false),
            nameInput = useRef<HTMLInputElement>(null),
            [ source, setSource ] = React.useState("management"),
        
            formError = form.management.get("formError"),
            isSubmitting = form.management.get("isSubmitting"),
            isDirty = form.management.get("dirtyFields")?.size !== 0,
        
            toggleJSONSource = () => {
              setSource((
                source === "management" ? "formState" : "management"
              ));
            },
            toggle= () => setHide(!hide),
            focus = () => {
              if (nameInput && nameInput.current) {
                nameInput.current.focus();
              }
            };
        
          return (
            <form onSubmit={form.handleSubmit}>
              <FormPrompt dirty={isDirty} />
              <FormInner 
                focus={focus}
                formError={formError}
                formState={form.formState}
                hide={hide}
                isSubmitting={isSubmitting}
                nameInput={nameInput}
                setField={form.handleChange}
                toggle={toggle}
                toggleJSONSource={toggleJSONSource}
              /> 
              <ShowSum />     
              {
                NR_OF_ROWS > 10 ? null : (
                  <ImmutableFormJSON formData={form.getFormData()} />
                )
              }  
            </form>
          );
        }}
      </ImmutableForm>
    );
  };

export default ComplexForm;
