git status
read -p "Digite a mensagem de commit: " MSG
if [[ -z "$MSG" ]]; then
  printf "${RED}Mensagem de commit não pode ser vazia!${NC}\n"
  exit 1
fi

fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
printf "${GREEN}Branch atual: $BRANCH${NC}\n"


read -p "Deseja fazer push para o branch '$BRANCH'? (s/n) " PUSH
if [[ "$PUSH" =~ ^[sSyY]$ ]]; then
  git push origin "$BRANCH"
  printf "${GREEN}Push realizado com sucesso!${NC}\n"
else
  echo "Push cancelado. Commit realizado localmente."
fi
