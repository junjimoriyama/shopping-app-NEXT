'use client';
// react
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// redux
import { appearanceImageChange } from '@/lib/features/shopping/slice/ProductSlice';
import {
  fetchSupabaseData,
  addSupabaseData,
  updateSupabaseData,
  deleteSupabaseData
  } from '@/app/utils/supabaseFunk'
// icon
import { TrashIcon } from '@/public/icons/HeroIcons';
// css
import '@/sass/backOffice/edit.scss';
import { supabase } from '@/app/utils/supabase';

// 型定義 ===========================================

// 更新用商品
interface editProductState {
  [key: number]: {
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
  };
}
// 追加用商品
interface newProductData {
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const list = () => {
  /* state ===========================================*/
  // 商品
  const { productList } = useAppSelector((state) => state.product);
  // カテゴリー
  const { categoryList } = useAppSelector((state) => state.category);

  /* redux ===========================================*/
  const dispatch = useAppDispatch();

  /* hooks ===========================================*/
  // カテゴリー編集
  const [inputCategory, setInputCategory] = useState('');
  // 編集したデータを保存(id:{key: value}で保存)
  const [editProductData, setEditProductData] = useState<editProductState>({});
  // 更新成功モーダル
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // 成功
  const [isSuccess, setIsSuccess] = useState(false);
  // 失敗
  const [isFailure, setIsFailure] = useState(false);
  // 追加確認モーダル
  const [isAddConfModalOpen, setIsAddConfModalOpen] = useState(false);
  // 削除確認モーダル
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  // 削除番号
  const [deleteId, setDeleteId] = useState(0);

  // 初回レンダリング
  useEffect(() => {
    dispatch(fetchSupabaseData());
  }, []);

  /* 関数 ===========================================*/

  // TODO:商品の更新 ========================================================

  // 見た目画像の更新 --------------------------------
  // input要素
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  // 選択している画像id
  const [selectId, setSelectId] = useState(0);

  // ファイルを呼び出す
  const handleFileSelect = (id: number) => {
    inputFileRef.current?.click();
    setSelectId(id);
  };

  // 見た目の画像を変える
  const handleImageChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      // idをhandleFileSelectのidへ(ここでのidは商品数最後の数字になる)
      if (selectId > 0) {
        id = selectId;
      }
      const fileImage = e.target.files[0].name;
      // reduxで処理
      dispatch(appearanceImageChange({ id, fileImage }));
    }
  };

  // 説明入力欄の拡大 --------------------------------
  // 高さを広げる要素のid
  const [isExpandId, setIsExpandId] = useState(0);
  // 高さを広げる要素の真偽値
  const [isExpandState, setIsExpandState] = useState(false);
  const [isNewExpandState, setIsNewExpandState] = useState(false);

  // input要素をクリックしたときに幅を広げる関数
  const expandInput = (id: number) => {
    // 対象のid
    setIsExpandId(id);
    // 要素の伸び縮み
    setIsExpandState(!isExpandState);
    // もし対象のidでなければ
    if (isExpandId !== id) {
      // 要素の伸び縮み実行
      setIsExpandState(true);
    }
  };
  // 別の入力クリックと同時に開く
  useEffect(() => {
    // setIsExpandState(true)
  }, [isExpandState]);

  // 商品内容の更新 ----------------------------------
  /**
   * 指定されたIDのオブジェクトの特定のフィールドを更新します。
   * @param {number} id - 更新するオブジェクトのID。
   * @param {string} field - 更新するフィールド名。
   * @param {string | number} value - 新しい値。
   */
  const handleInputChange = (
    id: number,
    field: string,
    value: string | number,
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

  // 更新の実行 ----------------------------------
  const updateExecution = (id: number) => {
    const editData = editProductData[id] || {};
    const originalData = productList.find((item) => item.id === id);
    // 元データなければ
    if (!originalData) {
      throw new Error('error');
    }
    // 編集されているデータを優先
    const upDateProductData = {
      name: editData.name || originalData.name,
      price: editData.price || originalData.price,
      image: editData.image || originalData.image,
      category: editData.category || originalData.category,
      description: editData.description || originalData.description,
    };

    // 商品データの型(ユニオン型で取得)
    type ProductData = keyof typeof editData;
    // 変化があれば
    const hasChange = (
      ['name', 'price', 'image', 'category', 'description'] as ProductData[]
    ).some((field) => {
      // 編集のデータがundefinedではなく、元データが更新されていれば
      return (
        editData[field] !== undefined && editData[field] !== originalData[field]
      );
    });

    // 値に変化があれば
    if (hasChange) {
      dispatch(updateSupabaseData({ id, upDateProductData }))
        // createAsyncThunkの成功時の値を取得しやすく、失敗時にはエラーをスローするメソッド
        .unwrap()
        // 成功
        .then(() => {
          setIsUpdateModalOpen(true);
          setIsSuccess(true);
        })
        // 失敗
        .catch(() => {
          setIsUpdateModalOpen(true);
          setIsFailure(true);
        });
      // データを取得して画面に反映(originalData書き換え)
      dispatch(fetchSupabaseData());
    }
  };

  // onChange(onInput)したら編集前と編集後のデータに差異があればupdateボタンにクラスをつける

  const handleUpdateChange = (id: number) => {
    console.log(id)
  } 

  // TODO:商品の追加 ========================================================

  // 見た目画像の更新 ----------------------------------
  // input要素
  const inputNewFileRef = useRef<HTMLInputElement | null>(null);
  // 見た目画像を変える
  const handleAddNewImage = () => {
    inputNewFileRef.current?.click();
  };

  // 追加する商品データ初期値
  const initialNewProductData = {
    name: '',
    price: 0,
    image: '',
    category: '',
    description: '',
  };

  // 追加商品の準備　----------------------------------
  // 追加する商品データ状態
  const [addNewProductData, setAddNewProductData] = useState<newProductData>(
    initialNewProductData,
  );

  // 商品追加の処理
  const addNewProduct = (
    e:
      | ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>,
    field: string,
  ) => {
    let value: string | number;
    if (field === 'image') {
      // 型定義(変数化する必要あり)
      const input = e.target as HTMLInputElement;
      value = input.files?.[0].name ?? '';
    } else if (field === 'price') {
      value = Number(e.target.value);
    } else {
      value = e.target.value;
    }
    // 動的fieldに値を保存
    setAddNewProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 追加の実行 ----------------------------------
  const addExecution = () => {
    dispatch(addSupabaseData({ addNewProductData })).then(() => {
      // データを取得して画面に反映
      dispatch(fetchSupabaseData());
      // モーダル閉じる
      setIsAddConfModalOpen(false);
      // 入力欄を全て空にする
      setAddNewProductData(initialNewProductData);
    });
  };

  // TODO:商品の削除 ========================================================

  // 削除の実行
  const deleteExecution = (id: number) => {
    dispatch(deleteSupabaseData(id))
      // createAsyncThunkの成功時の値を取得しやすく、失敗時にはエラーをスローするメソッド
      .unwrap()
      .then(() => {
        // データを取得して画面に反映
        dispatch(fetchSupabaseData());
        // モーダル閉じて
        setIsDeleteConfModalOpen(false);
        // 削除番号初期化
        setDeleteId(0);
      });
  };

  return (
    <div className="update">
      <div className="title">update Data</div>
      <div className="updateProduct">
        <table>
          <thead className="field">
            <tr>
              <th className="id">id</th>
              <th className="name">name</th>
              <th className="price">price</th>
              <th className="img">image</th>
              <th className="category">category</th>
              <th className="description">description</th>
              <th className="edit">update</th>
              <th className="delete">delete</th>
            </tr>
          </thead>
          <tbody className="datalist">
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
                      onChange={(e) => {
                        handleInputChange(item.id, 'name', e.target.value);
                        handleUpdateChange(item.id)
                      }}
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
                          'price',
                          Number(e.target.value),
                        )

                      }
                      defaultValue={item.price}
                      min="0"
                      step="10"
                    />
                  </td>
                  {/* 画像 */}
                  <td className="image">
                    <img src={`/images/${item.image}`} />
                    <input
                      type="file"
                      ref={inputFileRef}
                      onChange={(e) => {
                        // 画像をdbで差し替える
                        handleInputChange(
                          item.id,
                          'image',
                          e.target.files ? e.target.files[0].name : '',
                        );
                        // 見た目の画像を変える
                        handleImageChange(item.id, e);
                      }}
                      accept=".png"
                      style={{
                        display: 'none',
                      }}
                    />
                    <button
                      className="fileSelectBtn"
                      onClick={() => handleFileSelect(item.id)}
                    >
                      select
                    </button>
                  </td>
                  {/* カテゴリー */}
                  <td className="category">
                    <select
                      onChange={(e) =>
                        handleInputChange(item.id, 'category', e.target.value)
                      }
                      // 各カテゴリーに合うものを表示
                      defaultValue={item.category}
                    >
                      {categoryList.map((category) => {
                        return <option key={category}>{category}</option>;
                      })}
                    </select>
                  </td>
                  {/* 説明 */}
                  <td className="description">
                    <textarea
                      className={`${item.id === isExpandId && isExpandState ? 'isExpand' : ''}`}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          'description',
                          e.target.value,
                        )
                      }
                      onClick={() => expandInput(item.id)}
                      defaultValue={item.description}
                    />
                  </td>

                  {/* アップデートボタン */}
                  <td className="_update">
                    <button
                      onClick={() => updateExecution(item.id)}
                      className="updateBtn"
                    >
                      update
                    </button>
                  </td>

                  {/* 削除ボタン */}
                  <td className="_delete">
                    <button
                      className="deleteBtn"
                      onClick={() => {
                        setIsDeleteConfModalOpen(true);
                        setDeleteId(item.id);
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>

          {/* 間を開ける */}
          <tbody style={{ height: '20px', lineHeight: '0' }}>
            <tr
              style={{ padding: '0', border: 'none', background: 'none' }}
            ></tr>
          </tbody>

          {/* データの追加 */}
          <tbody className="addProduct">
            <tr>
              <td className="newId"></td>
              {/* 新しい名前 */}
              <td className="newName">
                <input
                  onChange={(e) => addNewProduct(e, 'name')}
                  value={addNewProductData.name}
                />
              </td>
              {/* 新しい値段 */}
              <td className="newPrice">
                <input
                  type="number"
                  min={0}
                  step={10}
                  onChange={(e) => addNewProduct(e, 'price')}
                  value={addNewProductData.price}
                />
              </td>
              {/* 新しい画像 */}
              <td className="newImage">
                {addNewProductData.image && (
                  <img
                    src={`/images/${addNewProductData.image}`}
                    alt="newImage"
                  />
                )}

                <input
                  type="file"
                  onChange={(e) => addNewProduct(e, 'image')}
                  ref={inputNewFileRef}
                  accept=".png"
                  style={{
                    display: 'none',
                  }}
                />
                <button
                  className="newFileSelectBtn"
                  onClick={() => handleAddNewImage()}
                >
                  select
                </button>
              </td>
              {/* 新しいカテゴリー */}
              <td className="newCategory">
                <select
                  onChange={(e) => addNewProduct(e, 'category')}
                  value={addNewProductData.category}
                >
                  {categoryList.map((category) => {
                    return <option key={category}>{category}</option>;
                  })}
                </select>
              </td>

              {/* 新しい説明 */}
              <td className="newDescription">
                <textarea
                  className={`${isNewExpandState ? 'isExpand' : ''}`}
                  onChange={(e) => addNewProduct(e, 'description')}
                  onClick={() => setIsNewExpandState(!isNewExpandState)}
                  value={addNewProductData.description}
                ></textarea>
              </td>
              <td className="add" colSpan={2}>
                <button
                  className="addBtn"
                  onClick={() => setIsAddConfModalOpen(true)}
                >
                  add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* モーダル */}
      {/* 更新 */}
      <div
        className={`mask ${isUpdateModalOpen ? 'isOpen' : ''}`}
        onClick={() => {
          setIsUpdateModalOpen(false);
          setIsSuccess(false);
        }}
      ></div>
      <div className={`updateModal ${isSuccess ? 'isOpen' : ''}`}>
        {/* 成功 */}
        <div className="modalWrap">
          {isSuccess ? <p>success</p> : <p></p>}
          {isFailure ? <p>failure</p> : <p></p>}

          <button
            className="closeBtn"
            onClick={() => {
              setIsUpdateModalOpen(false);
              setIsSuccess(false);
            }}
          >
            close
          </button>
        </div>
      </div>

      {/* 追加 */}
      <div
        className={`mask ${isAddConfModalOpen ? 'isOpen' : ''}`}
        onClick={() => {
          setIsAddConfModalOpen(false);
        }}
      ></div>
      <div className={`deleteConfModal ${isAddConfModalOpen ? 'isOpen' : ''}`}>
        <div className="modalWrap">
          <p>Realy add?</p>
          <div className="judgeBtn">
            <button className="yesBtn" onClick={addExecution}>
              Yes
            </button>
            <button
              className="noBtn"
              onClick={() => {
                setIsAddConfModalOpen(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* 削除 */}
      <div
        className={`mask ${isDeleteConfModalOpen ? 'isOpen' : ''}`}
        onClick={() => {
          setIsDeleteConfModalOpen(false);
          setDeleteId(0);
        }}
      ></div>
      <div
        className={`deleteConfModal ${isDeleteConfModalOpen ? 'isOpen' : ''}`}
      >
        <div className="modalWrap">
          <p>Realy delete?</p>
          <div className="judgeBtn">
            <button
              className="yesBtn"
              onClick={() => deleteExecution(deleteId)}
            >
              Yes
            </button>
            <button
              className="noBtn"
              onClick={() => {
                setIsDeleteConfModalOpen(false);
                setDeleteId(0);
              }}
            >
              No
            </button>
          </div>
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

{
  /* <div className="updateCategory">
  <div className="categoryList">
    {categoryList.map((category) => {
      return (
        <li className="eachCategory" key={category}>
          {category}
          <div
            className="deleteCategory"
            onClick={() => dispatch(deleteCategory(category))}
          >
            ×
          </div>
        </li>
      );
    })}
  </div>
  <input
    type="text"
    onChange={(e) => setInputCategory(e.target.value)}
    placeholder="addCategory"
  />
  <button className="addCategoryBtn" onClick={() => handleAddCategory()}>
    Add
  </button>
</div>; */
}
