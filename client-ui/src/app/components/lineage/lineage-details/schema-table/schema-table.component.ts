/*
 * Copyright 2019 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {DataTypeType} from 'src/app/model/types/dataTypeType';
import {AttributeVM, StructFieldVM} from 'src/app/model/viewModels/attributeVM';
import {DataTypeVM} from "../../../../model/viewModels/dataTypeVM";

@Component({
  selector: 'schema-table',
  templateUrl: './schema-table.component.html'
})
export class SchemaTableComponent implements AfterViewInit, OnDestroy {

  @ViewChild('table', {static: true})
  public table: any

  @Input()
  public schema: StructFieldVM[]

  @Input()
  public schemaId: string

  @Output()
  public fieldSelected = new EventEmitter<StructFieldVM>()

  public tablePageSize: number = 5

  private subscriptions: Subscription[] = []

  public ngAfterViewInit(): void {
    /*
        this.subscriptions.push(
          this.store
            .select('router', 'state', 'queryParams')
            .subscribe((queryParams: any) => {
              if (queryParams) {
                const paramsSubscriber = this
                const schemaIdParam = queryParams.schemaId
                const tablesWithSelection = schemaIdParam ? schemaIdParam.split(".") : []
                if (paramsSubscriber.table.rows && paramsSubscriber.schemaId.includes(tablesWithSelection[0])) {
                  for (let i = 0; i < tablesWithSelection.length + 1; i++) {
                    //The attribute ID can be nested to several data structures, the last one is the selected attribute itself
                    const attributeIdParam = (i < tablesWithSelection.length) ? tablesWithSelection[i + 1] : queryParams.attribute
                    const selectedRow = paramsSubscriber.getSelectedRowFromName(attributeIdParam)
                    const selectedRowIndex = selectedRow[0]
                    const selectedRowContent = selectedRow[1]

                    if (selectedRowIndex > -1) {
                      paramsSubscriber.table.selected.push(selectedRowContent)
                      paramsSubscriber.table.offset = Math.floor(selectedRowIndex / paramsSubscriber.tablePageSize)
                      // TODO : Remove the setTimeout as soon as this issue is fixed :https://github.com/swimlane/ngx-datatable/issues/1204
                      setTimeout(function () {
                        if (
                          selectedRowContent.dataType._type != DataTypeType.Simple
                          && !(DataTypeType.Array && selectedRowContent.dataType.elementDataType && selectedRowContent.dataType.elementDataType.dataType._type == DataTypeType.Simple)
                        ) {
                          paramsSubscriber.table.rowDetail.toggleExpandRow(selectedRowContent)
                        }
                      })
                    }
                  }
                }
              }
            })
        )
    */
  }

  /**
   * Gets selected row from name
   * @param name the name of the attribute
   * @returns a tuple containing the AttributeVM of the row and its index in case the table is pageable
   */
  private getSelectedRowFromName = (name: string): [number, AttributeVM] => {
    const index = _.findIndex(this.table.rows, {name: name})
    return [index, this.table.rows[index]]
  }


  public getChildSchemaId = (parentSchemaId: string, rowName: string): string => {
    return parentSchemaId + "." + rowName
  }

  public getArrayInnermostElementTypeWithNestingLevel = (dt: DataTypeVM, level = 1): [DataTypeVM, number] => {
    return dt.elementDataType.dataType._type == DataTypeType.Array
      ? this.getArrayInnermostElementTypeWithNestingLevel(dt.elementDataType.dataType, level + 1)
      : [dt.elementDataType.dataType, level]
  }

  public onStructTypeClick(e, row) {
    e.stopPropagation()
    this.table.rowDetail.toggleExpandRow(row)
  }

  public onSelect = ({selected}): void => {
    const selectedAttribute = selected[0]
    this.fieldSelected.emit(selectedAttribute)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

}
