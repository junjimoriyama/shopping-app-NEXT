// css
import { use, useState } from "react";
import "../../sass/pagination.scss";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { selectedNumber } from "@/lib/features/shopping/slice/ProductSlice";

interface PageNationProps {
  perView: number;
  setPerView: (num: number) => void;
  displayedCount: number;
  paginate: (num: number) => void;
  prevPagination: () => void;
  nextPagination: () => void;
  activePage: number;
  setActivePage: (page: number) => void;
  setStartPageNum: (num: number) => void;
  setEndPageNum: (num: number) => void;
}

export const PagiNation: React.FC<PageNationProps> = ({
  perView,
  setPerView,
  displayedCount,
  paginate,
  prevPagination,
  nextPagination,
  activePage,
  setActivePage,
  setStartPageNum,
  setEndPageNum,
}) => {
  // state
  const { productList, total } = useAppSelector((state) => state.product);

  // ページ数の計算
  const [ totalPage, setTotalPage  ] = useState(Math.ceil(productList.length / perView) )

  const dispatch = useAppDispatch();


  return (
    <div className="pagination">
      <div className="wrap">
        {/* 前に戻るボタン */}
        <button className="prevBtn" onClick={prevPagination}>
          ◀︎
        </button>
        {/* ページ番号 */}
        {Array.from({ length: totalPage }, (_, i) => (
          <button
            className={`pageNum ${i + 1 === activePage ? "isActive" : ""}`}
            key={i}
            onClick={() => {
              paginate(i);
              setActivePage(i + 1);
            }}
          >
            {i + 1}
          </button>
        ))}
        {/* 次に進むボタン */}
        <button className="nextBtn" onClick={nextPagination}>
          ▶︎
        </button>
      </div>

      <div className="PerPageSelect">
        <p className="displayedNum">NUMBER</p>
        <select
          name=""
          id=""
          onChange={(e) => {
            const selectedValue = e.target.value;
            if (selectedValue === "all") {
              // 全ての商品表示
              setPerView(displayedCount),
                // 表示ページ開始
                setStartPageNum(0),
                // 表示ページ終了
                setEndPageNum(displayedCount);
              // アクティブページを1に戻す
              setActivePage(1);
              setTotalPage(1)
            } else {
              // 選ばれた件数
              const newPer = Number(e.target.value);
              // 表示件数更新
              setPerView(newPer);
              // 表示ページ開始
              setStartPageNum(0);
              // 表示ページ終了
              setEndPageNum(newPer);
              // アクティブページを1に戻す
              setActivePage(1);
              setTotalPage( displayedCount / newPer)
            }
          }}
        >
          {/* <option value="all"></option> */}
          <option value="all">all</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>
        </select>
      </div>
    </div>
  );
};
