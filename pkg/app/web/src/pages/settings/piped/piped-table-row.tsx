import {
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { FC, memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import {
  UI_TEXT_EDIT,
  UI_TEXT_DISABLE,
  UI_TEXT_ENABLE,
  UI_TEXT_RECREATE_KEY,
} from "../../../constants/ui-text";
import { AppState } from "../../../modules";
import { Piped, selectById } from "../../../modules/pipeds";

const useStyles = makeStyles((theme) => ({
  disabledItem: {
    background: theme.palette.grey[200],
  },
}));

interface Props {
  pipedId: string;
  onEdit: (id: string) => void;
  onRecreateKey: (id: string) => void;
  onDisable: (id: string) => void;
  onEnable: (id: string) => void;
}

const ITEM_HEIGHT = 48;
const menuStyle = {
  style: {
    maxHeight: ITEM_HEIGHT * 4.5,
    width: "20ch",
  },
};

export const PipedTableRow: FC<Props> = memo(function PipedTableRow({
  pipedId,
  onEnable,
  onDisable,
  onEdit,
  onRecreateKey,
}) {
  const classes = useStyles();
  const piped = useSelector<AppState, Piped.AsObject | undefined>((state) =>
    selectById(state.pipeds, pipedId)
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleEdit = useCallback(() => {
    setAnchorEl(null);
    onEdit(pipedId);
  }, [pipedId, onEdit]);

  const handleRecreate = useCallback(() => {
    setAnchorEl(null);
    onRecreateKey(pipedId);
  }, [pipedId, onRecreateKey]);

  const handleEnable = useCallback(() => {
    setAnchorEl(null);
    onEnable(pipedId);
  }, [pipedId, onEnable]);

  const handleDisable = useCallback(() => {
    setAnchorEl(null);
    onDisable(pipedId);
  }, [pipedId, onDisable]);

  if (!piped) {
    return null;
  }

  return (
    <>
      <TableRow
        key={`pipe-${piped.id}`}
        className={clsx({ [classes.disabledItem]: piped.disabled })}
      >
        <TableCell>
          <Typography variant="subtitle2">
            {`${piped.name} (${piped.id.slice(0, 8)})`}
          </Typography>
        </TableCell>
        <TableCell>{piped.version}</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {piped.desc}
          </Typography>
        </TableCell>
        <TableCell>
          {piped.startedAt === 0
            ? "Not Yet Started"
            : dayjs(piped.startedAt * 1000).fromNow()}
        </TableCell>
        <TableCell align="right">
          <IconButton
            edge="end"
            aria-label="open menu"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Menu
        id="piped-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={menuStyle}
      >
        {piped.disabled ? (
          <MenuItem onClick={handleEnable}>{UI_TEXT_ENABLE}</MenuItem>
        ) : (
          [
            <MenuItem key="piped-menu-edit" onClick={handleEdit}>
              {UI_TEXT_EDIT}
            </MenuItem>,
            <MenuItem key="piped-menu-recreate" onClick={handleRecreate}>
              {UI_TEXT_RECREATE_KEY}
            </MenuItem>,
            <MenuItem key="piped-menu-disable" onClick={handleDisable}>
              {UI_TEXT_DISABLE}
            </MenuItem>,
          ]
        )}
      </Menu>
    </>
  );
});
