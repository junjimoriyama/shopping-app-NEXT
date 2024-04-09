// 新規作成

// 更新
"use client";

import {
  fetchSupabaseData,
  updateSupabaseData,
} from "@/lib/features/shopping/slice/ProductSlice";
import { addCategory, deleteCategory } from "@/lib/features/shopping/slice/CategorySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ChangeEvent, useEffect, useState } from "react";

// css
import "@/sass/backOffice/edit.scss";

const list = () => {
  // state
  const { productList } = useAppSelector((state) => state.product);
  const { categoryList } = useAppSelector((state) => state.category);

  const dispatch = useAppDispatch();

  // 初回レンダリング
  useEffect(() => {
    dispatch(fetchSupabaseData());
  }, []);

  // カテゴリー編集
  const [inputCategory, setInputCategory] = useState("");

  // 編集データの型
  interface editProductState {
    [key: number]: {
      name: string;
      price: number;
      image: string;
      category: string;
    };
  }

  // 編集したデータを保存(id:{key: value}で保存)
  const [editProductData, setEditProductData] = useState<editProductState>({});

  /**
   * 指定されたIDのオブジェクトの特定のフィールドを更新します。
   * @param {number} id - 更新するオブジェクトのID。
   * @param {string} field - 更新するフィールド名。
   * @param {string | number} value - 新しい値。
   */
  const handleInputChange = (
    id: number,
    field: string,
    value: string | number
  ) => {
    // 前のeditProductDataの状態をコピーして展開
    // オブジェクトID(メモリアドレス)を変わらないと更新の認識をされない。
    setEditProductData((prev) => ({
      ...prev,
      // 動的なobject生成(例: 1: {'name': 'carrot'})
      [id]: {
        // 動的生成された以前のobjectの状態を保ちつつ、変更箇所を更新(1: {'name': 'carrot'}を保ち、1: {'price': '100'}の操作が行われれば'name'と'price'の変更を行う。...prev[id]をしないと'price'の変更した時に'name'が上書きされ、更新されない。)
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // モーダル
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // 成功
  const [isSuccess, setIsSuccess] = useState(false);
  // 失敗
  const [isFailure, setIsFailure] = useState(false);

  // 編集内容の反映
  const updateExecution = (id: number) => {
    const editData = editProductData[id] || {};
    const originalData = productList.find((item) => item.id === id);
    // 元データなければ
    if (!originalData) {
      throw new Error("error");
    }
    // 編集されているデータを優先
    const upDateProductData = {
      name: editData.name || originalData.name,
      price: editData.price || originalData.price,
      image: editData.image || originalData.image,
      category: editData.category || originalData.category,
    };
    dispatch(updateSupabaseData({ id, upDateProductData }))
      // createAsyncThunkの成功時の値を取得しやすく、失敗時にはエラーをスローするメソッド
      .unwrap()
      // 成功
      .then(() =>{ 
        setIsUpdateModalOpen(true)
        setIsSuccess(true)
      })
      // 失敗
      .catch(() => {
        setIsUpdateModalOpen(true)
        setIsFailure(true)
      });
  };

  // カテゴリー追加
  const handleAddCategory = () => {
    dispatch(addCategory(inputCategory))
  }

  // // カテゴリー削除
  // const handleDeleteCategory = (id: number) => {
  //   dispatch(deleteCategory(id))
  // }

  return (
    <div className="update">
      <div className="updateProduct">
        <table>
          <thead className="field">
            <tr>
              <th className="id">id</th>
              <th className="name">name</th>
              <th className="price">price</th>
              <th className="img">image</th>
              <th className="category">category</th>
              <th className="editBtn">update</th>
            </tr>
          </thead>
          <tbody className="list">
            {[...productList]
              // id順
              .sort((a, b) => a.id - b.id)
              .map((item) => (
                <tr className="eachProduct" key={item.id}>
                  {/* id */}
                  <td className="id">{item.id}</td>
                  {/* 名前 */}
                  <td className="name">
                    <input
                      onChange={(e) =>
                        handleInputChange(item.id, "name", e.target.value)
                      }
                      defaultValue={item.name}
                    />
                  </td>
                  {/* 値段 */}
                  <td className="price">
                    <input
                      type="number"
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      defaultValue={item.price}
                      min="0"
                      step="10"
                    />
                  </td>
                  {/* 画像 */}
                  <td className="img">
                    <input
                      onChange={(e) => {
                        // 入力値をそのまま状態にセット
                        handleInputChange(item.id, "image", e.target.value);
                      }}
                      onBlur={(e) => {
                        // フォーカスが外れた時に末尾に .png を追加
                        let inputValue = e.target.value;
                        if (!inputValue.endsWith(".png")) {
                          inputValue += ".png";
                          // 更新された値で状態を更新
                          handleInputChange(item.id, "image", inputValue);
                        }
                      }}
                      // 更新データがない場合は元データ、それもなければ空
                      value={
                        editProductData[item.id]?.image ?? item.image ?? ""
                      }
                    />
                  </td>
                  <td className="category">
                    <select
                      onChange={(e) =>
                        handleInputChange(item.id, "category", e.target.value)
                      }
                      // 各カテゴリーに合うものを表示
                      defaultValue={item.category}
                    >
                      {categoryList.map((category) => {
                        return <option key={category}>{category}</option>;
                      })}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => updateExecution(item.id)}
                      className="updateBtn"
                    >
                      update
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="updateCategory">
        <div className="categoryList">{categoryList.map(category => {
          return <li 
          className="eachCategory"
          key={category}>
            {category}
            <div 
            className="deleteCategory"
            onClick={() => dispatch(deleteCategory(category))}
            >
            ×</div>
          </li>
        })}</div>
        <input
          type="text"
          onChange={(e) => setInputCategory(e.target.value)}
          placeholder="addCategory"
        />
        <button
            className="addCategoryBtn"
            onClick={() => handleAddCategory()}
          >
            Add
          </button>
      </div>

          {/* モーダル */}
      <div
        className={`updateMask ${isUpdateModalOpen ? "isOpen" : ""}`}
        onClick={() => {
          setIsUpdateModalOpen(false)
          setIsSuccess(false)
          }}
      ></div>
      <div className={`updateModal ${isSuccess ? "isOpen" : ""}`}>
        {/* 成功 */}
        <div className="modalWrap">
          { isSuccess ? <p>success</p> : <p></p> }
          { isFailure ? <p>failure</p> : <p></p> }
          
          <button 
          className="closeBtn"
          onClick={() => {
            setIsUpdateModalOpen(false)
            setIsSuccess(false)
            }}>close</button>
        </div>
      </div>
    </div>
  );
};

export default list;

// // 新規作成画面へのリンク

// // 更新画面へのリンク、削除
// /*
// *dbからshoppingテーブルから全情報を取得
// * postgrestの使い方(?)、restAPIの理解必要
// * 画面のHTML、CSSを作成
// * dbから返ってきたjsonデータを画面に表示
// * backoffice用の認証は必要
// */

// 編集ボタン
// edit.tsxにリンク　formタグ用意（新規なら空、該当商品編集なら予め商品情報入る）
// 更新ボタン押すと一覧画面を表示(場合によって)

